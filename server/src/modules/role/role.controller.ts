import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Permission } from 'src/guards/decorators/permission.decorator';

@Controller('role')
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('Roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Permission('write:roles')
  @ApiBearerAuth()
  async create(@Body() createRoleDto: CreateRoleDto) {
    console.log(createRoleDto, 'in controller of roles');
    return await this.roleService.create(createRoleDto);
  }

  @Get()
  @Permission('read:roles')
  @ApiBearerAuth()
  async findAll() {
    return await this.roleService.findAll();
  }

  @Delete(':id')
  @Permission('write:roles')
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    return await this.roleService.delete(id);
  }

  @Put(':id')
  @Permission('write:roles')
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() roleDto: UpdateRoleDto) {
    return await this.roleService.update(id, roleDto);
  }
}
