import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId } from 'class-validator';

export class AssignPermissionDto {
  @ApiPropertyOptional({
    example: '67179656b6270799b27accb6',
  })
  @IsNotEmpty()
  @IsMongoId()
  roleId: string;

  @ApiPropertyOptional({
    example: '6718b6e2ba60a0f385255715',
  })
  @IsNotEmpty()
  @IsMongoId()
  permissionId: string;
}
