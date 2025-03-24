import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Permission } from 'src/guards/decorators/permission.decorator';

@Controller('permissions')
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('Permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Permission('write')
  @ApiBearerAuth()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @Permission('read:permission')
  @ApiBearerAuth()
  async findAll() {
    return await this.permissionsService.findAll();
  }

  @Patch(':id')
  @Permission('write')
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() createPermissionDto: CreatePermissionDto,
  ) {
    return await this.permissionsService.update(id, createPermissionDto);
  }

  @Delete(':id')
  @Permission('write')
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return await this.permissionsService.remove(id);
  }
}
