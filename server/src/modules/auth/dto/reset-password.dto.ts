import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate, MinLength } from 'class-validator';
import { PasswordMatchesValidator } from 'src/validators/password-matches-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'asg32fw' })
  code: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: 'New password is too short. It should be at least 6 characters.',
  })
  @ApiProperty({ example: '12345678' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Validate(PasswordMatchesValidator, ['password'])
  @MinLength(6, {
    message:
      'Confirm password is too short. It should be at least 6 characters.',
  })
  @ApiProperty({ example: '12345678' })
  confirmPassword: string;
}
