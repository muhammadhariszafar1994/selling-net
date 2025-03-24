import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../../guards/role.guard';
import { Permission } from 'src/guards/decorators/permission.decorator';

@ApiTags('User')
@UseGuards(AuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @Permission('write:users')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create user',
    required: true,
    schema: {
      type: 'object',
      properties: {
        firstname: { type: 'string', example: 'John' },
        lastname: { type: 'string', example: 'Doe' },
        age: { type: 'number', example: 30 },
        gender: { type: 'string', example: 'Male' },
        email: { type: 'string', example: 'johndoe@yopmail.com' },
        password: { type: 'string', example: '12345678' },
        phone: { type: 'string', example: '1234567890' },
        address: { type: 'string', example: '123 Main St' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'User image file',
        },
        roles: {
          type: 'array',
          example: ['user', 'admin'],
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User created successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or authentication error.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (image && !image.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }
    return this.userService.create(createUserDto, image);
  }

  @Get()
  @Permission('read:users')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Optional search hospitals by name or location',
  })
  async findAll(@Query() params) {
    return this.userService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  @Patch(':id')
  @Permission('write:users')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create user',
    required: true,
    schema: {
      type: 'object',
      properties: {
        firstname: { type: 'string', example: 'John' },
        lastname: { type: 'string', example: 'Doe' },
        age: { type: 'number', example: 30 },
        gender: { type: 'string', example: 'Male' },
        phone: { type: 'string', example: '1234567890' },
        address: { type: 'string', example: '123 Main St' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'User image file',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or authentication error.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (image && !image.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    return this.userService.update(id, updateUserDto, image);
  }

  @Delete(':id')
  @Permission('write:users')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
