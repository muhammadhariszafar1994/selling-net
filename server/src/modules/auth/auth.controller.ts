import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UseGuards,
  Req,
  Put,
  UploadedFile,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from './auth.guard';
import { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RolesGuard } from 'src/guards/role.guard';
// import { AssignRoleDto } from '../user/dto/assign-role.dto';
import { AssignPermissionDto } from '../role/dto/assign-permission.dto';

@Controller('v1/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('file'))
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseInterceptors(FileInterceptor('file'))
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  changePassword(
    @Req() request: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(request, changePasswordDto);
  }

  @Post('forget-password')
  @UseInterceptors(FileInterceptor('file'))
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto);
  }

  @Post('reset-password')
  @UseInterceptors(FileInterceptor('file'))
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Put('update-profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  // @ApiOperation({ summary: 'Update user profile' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update profile data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        firstname: { type: 'string', example: 'John' },
        lastname: { type: 'string', example: 'Doe' },
        age: { type: 'number', example: 30 },
        gender: { type: 'string', example: 'Male' },
        // email: { type: 'string', example: 'johndoe@yopmail.com' },
        phone: { type: 'string', example: '1234567890' },
        address: { type: 'string', example: '123 Main St' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Profile image file',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or authentication error.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseInterceptors(FileInterceptor('image'))
  async updateProfile(
    @Req() request: Request,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file && !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }
    return this.authService.updateProfile(request, updateProfileDto, file);
  }

  @Post('logout')
  logout(@Req() req: Request) {
    console.log(req,"logout req in controller")
    return this.authService.logout(req);
  }

  // @Post('assign-role')
  // @UseGuards(AuthGuard, RolesGuard)
  // @ApiBearerAuth()
  // @UseInterceptors(FileInterceptor('image'))
  // assignRole(@Body() { userId, roleId }: AssignRoleDto) {
  //   return this.authService.assignRole(userId, roleId);
  // }

  @Post('assign-permission')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  assignPermission(@Body() { roleId, permissionId }: AssignPermissionDto) {
    return this.authService.assignPermission(roleId, permissionId);
  }
}
