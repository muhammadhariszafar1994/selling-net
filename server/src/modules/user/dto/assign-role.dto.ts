import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId } from 'class-validator';

export class AssignRoleDto {
  @ApiPropertyOptional({
    example: '6717dea31d6b7d9ef92e9ecf',
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiPropertyOptional({
    example: '6718d182f8cf847787faf348',
  })
  @IsNotEmpty()
  @IsMongoId()
  roleId: string;
}
