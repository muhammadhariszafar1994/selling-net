import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
export class CreateRoleDto {
  @ApiProperty({ example: 'person' })
  @IsString()
  name: string;

  @IsArray()
  permissions: string[];

  createdAt: string;
}
