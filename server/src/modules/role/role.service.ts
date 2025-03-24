import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/roles.schema';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { Permission } from '../permissions/schemas/permission.schema';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}

  async create(
    roleDto: CreateRoleDto,
  ): Promise<{ isShowToast: boolean; data: Role; message: string }> {
    try {
      const { permissions } = roleDto;
      console.log(permissions, 'in service from controller');
      const permissionFound = await this.permissionModel.find({
        _id: permissions,
      });
      console.log(permissionFound, 'permission found');
      const roleName = roleDto.name.toLowerCase();

      const existingRole = await this.roleModel
        .findOne({ name: roleName })
        .exec();
      if (existingRole) {
        throw new ConflictException('Role with this name already exists');
      }

      const role = new this.roleModel({
        name: roleName,
        permissions: permissionFound,
      });
      const data = await role.save();
      return {
        isShowToast: true,
        data: data,
        message: 'Role added successfully!',
      };
    } catch (error) {
      throw new ConflictException(
        'Error while creating role: ' + error.message,
      );
    }
  }

  async findAll(): Promise<{ isShowToast: boolean; data: Role[] }> {
    try {
      const data = await this.roleModel.find().populate('permissions').exec();
      return {
        isShowToast: true,
        data: data,
      };
    } catch (error) {
      throw new Error('Error while retrieving roles: ' + error.message);
    }
  }

  async update(
    id: string,
    roleDto: UpdateRoleDto,
  ): Promise<{ isShowToast: boolean; data: Role; message: string } | null> {
    try {
      const { name, permissions } = roleDto;
      const roleName = name.toLowerCase();

      const existingRole = await this.roleModel.findById(id).exec();
      if (!existingRole) {
        throw new NotFoundException('Role not found');
      }

      const roleWithSameName = await this.roleModel
        .findOne({ name: roleName })
        .exec();
      if (roleWithSameName && roleWithSameName.id !== id) {
        throw new ConflictException('Role with this name already exists');
      }

      const data = await this.roleModel
        .findByIdAndUpdate(
          id,
          { name: roleName, permissions: permissions },
          { new: true },
        )
        .exec();

      return {
        isShowToast: true,
        data: data,
        message: 'Role update successfully!',
      };
    } catch (error) {
      throw new Error('Error while updating role: ' + error.message);
    }
  }

  async delete(
    id: string,
  ): Promise<{ isShowToast: boolean; data: Role; message: string } | null> {
    try {
      const data = await this.roleModel.findByIdAndDelete(id).exec();
      if (!data) {
        throw new NotFoundException('Role not found');
      }
      return {
        isShowToast: true,
        data: data,
        message: 'Role deleted successfully!',
      };
    } catch (error) {
      throw new Error('Error while deleting role: ' + error.message);
    }
  }
}
