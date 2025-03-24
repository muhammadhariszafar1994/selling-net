import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import { Model, Types } from 'mongoose';
import { Role } from '../role/schemas/roles.schema';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  private isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  private isValidObjectId(id: string): boolean {
    return (
      Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id
    );
  }

  async create(createUserDto: CreateUserDto, image?: Express.Multer.File) {
    try {
      const { roles, password } = createUserDto;
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
      if (image) createUserDto.image = image.path;
      const data = await new this.userModel({
        ...createUserDto,
        password: hashedPassword,
        roles: roleIds,
      }).save();
      return {
        data: data,
        message: 'User created successfully!',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Error in creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(params) {
    const { search } = params;
    try {
      const query = {};
      if (search) {
        query['$or'] = [
          { firstname: { $regex: search, $options: 'i' } },
          { lastname: { $regex: search, $options: 'i' } },
          { gender: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
        ];
        if (!isNaN(search)) {
          query['$or'].push({ age: parseInt(search) });
        }
      }
      const data = await this.userModel
        .find(query)
        .populate({
          path: 'roles',
          populate: {
            path: 'permissions',
          },
        })
        .exec();
      return {
        message: 'Users fetched successfully!',
        data: data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Error in create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.userModel
        .findById(id)
        .populate({
          path: 'roles',
          populate: {
            path: 'permissions',
          },
        })
        .exec();
      if (!data) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'User fetched successfully!',
        data: data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Error in fetching user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    image: Express.Multer.File,
  ) {
    try {
      if (!id) {
        throw new BadRequestException('User not authenticated');
      }
      const { firstname, lastname, age, gender, email, phone, address, roles } =
        updateUserDto;
      if (email && !this.isValidEmail(email)) {
        throw new BadRequestException('Invalid email format');
      }
      const user = await this.userModel.findById(id).exec();
      console.log(user, 'user in update api');
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
      if (image) {
        // Assuming `file` is the uploaded image file
        user.image = image.path; // Save the file path or URL
      }
      if (roles && roles.length > 0) {
        const roleDocuments = await this.roleModel
          .find({
            $or: roles.map((role) => ({ name: role })),
          })
          .exec();
        if (roleDocuments.length !== roles.length) {
          throw new BadRequestException('Some roles are invalid or not found');
        }
        user.roles = roleDocuments;
      }
      await user.save();
      return {
        message: 'User updated successfully',
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
          roles: user.roles,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Error in update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      if (!this.isValidObjectId(id)) {
        throw new BadRequestException('Invalid user ID format');
      }
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (user.isSuperAdmin) {
        throw new BadRequestException('Super Admins cannot be deleted');
      }
      const result = await this.userModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Error in removing user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
