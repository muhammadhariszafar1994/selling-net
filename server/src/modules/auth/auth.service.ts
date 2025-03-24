import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/modules/user/schemas/users.schema';
import { Role } from 'src/modules/role/schemas/roles.schema';
import { ResetCode } from 'src/modules/resetcode/schemas/resetcode.schema';
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Roles } from '../role/entities/role.entity';
import { Permission } from '../permissions/schemas/permission.schema';
import { getPermissionsFromUser } from 'src/helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name, 'DATABASE_CONNECTION') private readonly userModel: Model<User>,
    @InjectModel(Role.name, 'DATABASE_CONNECTION') private readonly roleModel: Model<Role>,
    @InjectModel(Permission.name, 'DATABASE_CONNECTION') private readonly permissionModel: Model<Permission>,
    @InjectModel(ResetCode.name, 'DATABASE_CONNECTION') private readonly resetCodeModel: Model<ResetCode>,
    private readonly jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  private isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async login(loginDto: LoginDto): Promise<any> {
    try {
      const { email, password } = loginDto;

      const user = await this.userModel
        .findOne({ email })
        .populate({
          path: 'roles',
          populate: {
            path: 'permissions',
          },
        })
        .exec();
      if (!user) {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.BAD_REQUEST,
        );
      }

      const permissions = await getPermissionsFromUser(user);
      const firstname = user.firstname;
      const lastame = user.lastname;
      const fullname = firstname + ' ' + lastame;
      const payload = {
        fullname: fullname,
        sub: user.id,
        email: user.email,
        isSuperAdmin: user.isSuperAdmin,
        permissions: permissions,
        age: user.age,
        gender: user.gender,
        phone: user.phone,
        address: user.address,
        roles: user.roles,
      };
      const token = this.jwtService.sign(payload);

      return {
        token: token,
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          age: user.age,
          gender: user.gender,
          phone: user.phone,
          address: user.address,
          image: user.image,
        },
        message: 'Login Successfully!',
        clearStorage: true,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'Error logging in',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async register(registerDto: RegisterDto): Promise<any> {
    try {
      const { email, password, roles, ...userData } = registerDto;
      const existingUser = await this.userModel.findOne({ email }).exec();
      if (existingUser) {
        throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
      }
      if (!password || password.trim() === '') {
        throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log(hashedPassword, 'hashedPassword');
      const foundRoles = await this.roleModel
        .find({ name: { $in: roles } })
        .exec();
      if (!foundRoles || foundRoles.length === 0) {
        throw new HttpException(
          'Invalid roles provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      const roleIds = foundRoles.map((role) => role._id);
      const newUser = new this.userModel({
        ...userData,
        email,
        password: hashedPassword,
        roles: roleIds,
        created_at: new Date(),
        updated_at: new Date(),
      });
      const savedUser = await newUser.save();
      const permissions = foundRoles.reduce((acc, role) => {
        return [...acc, ...role.permissions];
      }, []);
      const jwtPayload = {
        sub: savedUser.id,
        email: savedUser.email,
        isSuperAdmin: savedUser.isSuperAdmin,
        permissions,
        age: savedUser.age,
        gender: savedUser.gender,
        phone: savedUser.phone,
        address: savedUser.address,
        roles: savedUser.roles,
      };
      const token = this.jwtService.sign(jwtPayload);
      return {
        token: token,
        user: {
          id: savedUser.id,
          firstname: savedUser.firstname,
          lastname: savedUser.lastname,
          email: savedUser.email,
          age: savedUser.age,
          gender: savedUser.gender,
          phone: savedUser.phone,
          address: savedUser.address,
          image: savedUser.image,
          roles: savedUser.roles,
        },
        message: 'Registered Successfully!',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Error registering',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changePassword(
    request: Request,
    changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    try {
      const userId = request['user']['sub'];
      const { currentPassword, newPassword } = changePasswordDto;

      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new HttpException('Invalid user', HttpStatus.BAD_REQUEST);
      }

      if (!currentPassword || currentPassword.trim() === '') {
        throw new HttpException(
          'Current password is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new HttpException(
          'Current password is incorrect',
          HttpStatus.BAD_REQUEST,
        );
      }

      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      user.password = hashedNewPassword;
      await user.save();

      return { message: 'Password successfully changed' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'Error change password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<any> {
    try {
      const { email } = forgetPasswordDto;

      const existingUser = await this.userModel.findOne({ email }).exec();
      if (!existingUser) {
        throw new HttpException(
          'Email does not exist!',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      await this.resetCodeModel.deleteMany({ email: email });

      const resetCode = new this.resetCodeModel({
        code: Math.floor(Math.random() * Date.now()).toString(36),
        email: email,
      });

      await resetCode.save();

      const subject = 'Reset password!';
      const message = `Your reset code is ${resetCode.code}`;

      await this.mailerService.sendMail({
        to: email,
        subject,
        text: message,
        from: process.env.MAIL_FROM_ADDRESS || 'WRG',
      });

      return {
        // code: resetCode.code,
        message: 'Reset code sent successfully!',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'Error forget password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    try {
      const saltOrRounds = 10;
      const { code, password } = resetPasswordDto;
      const hashPassword = await bcrypt.hash(password, saltOrRounds);

      const findResetCode = await this.resetCodeModel.findOne({ code });

      if (!findResetCode) {
        throw new HttpException(
          'Code does not exist!',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const user = await this.userModel.findOne({ email: findResetCode.email });

      if (!user) {
        throw new HttpException(
          'Email does not exist!',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      user.password = hashPassword;

      await user.save();

      await this.resetCodeModel.deleteOne({ code });

      return { message: 'Password has been reset successfully!' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'Error update password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfile(
    request: Request,
    updateProfileDto: UpdateProfileDto,
    file?: Express.Multer.File,
  ): Promise<any> {
    try {
      const userId = request['user']['sub'];

      if (!userId) {
        throw new BadRequestException('User not authenticated');
      }

      const { firstname, lastname, age, gender, email, phone, address } =
        updateProfileDto;

      if (email && !this.isValidEmail(email)) {
        throw new BadRequestException('Invalid email format');
      }

      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Update user fields
      if (firstname) user.firstname = firstname;
      if (lastname) user.lastname = lastname;
      if (age) user.age = age;
      if (gender) user.gender = gender;
      if (phone) user.phone = phone;
      if (address) user.address = address;

      // Handle image file
      if (file) {
        // Assuming `file` is the uploaded image file
        user.image = file.path; // Save the file path or URL
      }

      await user.save();

      return {
        message: 'Profile updated successfully',
        data: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          age: user.age,
          gender: user.gender,
          email: user.email,
          phone: user.phone,
          address: user.address,
          image: user.image,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async logout(req: any): Promise<any> {
  //   console.log(req.sessionIdContext,"session id")
  // }
  async logout(req: any): Promise<any> {
    try {
      // Check if session exists
      if (req.session) {
        // Destroy the session
        await new Promise((resolve, reject) => {
          req.session.destroy((err) => {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          });
        });

        // Clear session cookie
        req.res?.clearCookie('connect.sid'); // Replace with your actual session cookie name

        return {
          message: 'Logout successful',
          clearStorage: true, // Inform the frontend to clear localStorage/sessionStorage
        };
      } else {
        throw new HttpException('No active session found', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Error logging out',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // async assignRole(
  //   userId: string,
  //   roleId: string,
  // ): Promise<{ message: string; data: Users }> {
  //   try {
  //     let user = await this.userModel.findById(userId).lean();
  //     if (!user) throw new BadRequestException('Invalid user!');

  //     const role = await this.roleModel.findById(roleId).lean();
  //     if (!role) throw new BadRequestException('Invalid role!');

  //     if (
  //       user.roles &&
  //       user.roles.map((role) => role.toString()).includes(roleId)
  //     ) {
  //       return {
  //         message: 'Role is already assigned to the user.',
  //         data: user,
  //       };
  //     }

  //     user = await this.userModel
  //       .findByIdAndUpdate(userId, { $push: { roles: roleId } }, { new: true })
  //       .lean();

  //     return {
  //       message: 'Role assigned successfully!',
  //       data: user,
  //     };
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       throw error;
  //     }

  //     throw new HttpException(
  //       error.message || 'Error in assigning role',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async assignPermission(
    roleId: string,
    permissionId: string,
  ): Promise<{ message: string; data: Roles }> {
    try {
      // Fetch the role by ID using lean()
      let role = await this.roleModel.findById(roleId).lean();
      if (!role) throw new BadRequestException('Invalid role!');

      const permission = await this.permissionModel
        .findById(permissionId)
        .lean();
      if (!permission) throw new BadRequestException('Invalid permission!');

      console.log('role.permissions', role.permissions);

      if (
        role.permissions &&
        role.permissions
          .map((permission) => permission.toString())
          .includes(permissionId)
      ) {
        return {
          message: 'Role is already assigned to the user.',
          data: role,
        };
      }

      role = await this.roleModel
        .findByIdAndUpdate(
          roleId,
          { $push: { permissions: permissionId } },
          { new: true },
        )
        .lean();

      return {
        message: 'Permission assigned successfully!',
        data: role,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'Error in assigning permission',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
