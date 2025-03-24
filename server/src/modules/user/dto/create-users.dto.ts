import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstname?: string;

  @ApiPropertyOptional({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastname?: string;

  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'The age of the user',
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({
    description: 'The gender of the user',
    example: 'Male',
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({
    description: 'The email address of the user',
    example: 'johndoe@yopmail.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'The password of the user',
    example: '12345678',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    description: 'The phone number of the user',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'The address of the user',
    example: '123 Main St, Anytown, USA',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: "The path or URL of the user's profile image",
    example: '/uploads/profile-pic.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  roles?: string[];
}
