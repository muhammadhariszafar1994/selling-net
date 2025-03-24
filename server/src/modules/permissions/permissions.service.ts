import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Permission } from './schemas/permission.schema';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<{ isShowToast: boolean; data: Permission; message: string }> {
    try {
      const { name } = createPermissionDto;
      const existingPermission = await this.permissionModel.findOne({ name });
      if (existingPermission) {
        throw new ConflictException('Permission with this name already exists');
      }

      const permission = new this.permissionModel({ name });
      const savedPermission = await permission.save();

      return {
        isShowToast: true,
        data: savedPermission,
        message: 'Permission created successfully!',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create permission');
    }
  }

  async findAll(): Promise<{
    // isShowToast: boolean;
    data: Permission[];
    message: string;
  }> {
    try {
      const data = await this.permissionModel.find().exec();
      return {
        // isShowToast: true,
        data: data,
        message: 'Permissions Fetched',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get permission');
    }
  }

  async update(
    id: string,
    createPermissionDto: CreatePermissionDto,
  ): Promise<{ isShowToast: boolean; data: Permission; message: string }> {
    try {
      const updatedPermssion = await this.permissionModel
        .findByIdAndUpdate(id, createPermissionDto, { new: true })
        .exec();
      if (!updatedPermssion) {
        throw new NotFoundException('Permission not Found');
      }
      const data = updatedPermssion;
      return {
        isShowToast: true,
        data: data,
        message: 'Permission updtaed successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update permission');
    }
  }

  async remove(
    id: string,
  ): Promise<{ isShowToast: boolean; data: Permission; message: string }> {
    try {
      const deletedPermission = await this.permissionModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedPermission) {
        throw new NotFoundException('Permission not found');
      }
      const data = deletedPermission;
      return {
        isShowToast: true,
        data: data,
        message: 'Permission deleted succesfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete permission');
    }
  }
}
