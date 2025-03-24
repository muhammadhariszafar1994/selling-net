import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsNumber,
  IsOptional,
  Validate,
  IsArray,
} from 'class-validator';
import { PasswordMatchesValidator } from 'src/validators/password-matches-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'John' })
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Martin' })
  lastname: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: '30' })
  age: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'male' })
  gender: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'johndoe@yopmail.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '12345678' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Validate(PasswordMatchesValidator, ['password'])
  @ApiProperty({ example: '12345678' })
  confirmPassword: string;

  @IsOptional()
  @IsNumber()
  // @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  @ApiProperty({ example: '+123 4567 8900' })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'ABC House 1234, DEF street' })
  address?: string;

  @IsOptional()
  @IsString()
  attachment?: string;

  @IsOptional()
  @IsArray()
  roles?: string[];
}
