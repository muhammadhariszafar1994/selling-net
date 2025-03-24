import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from 'src/guards/decorators/permission.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    if (user.isSuperAdmin) {
      return true;
    }

    const requiredModules = requiredPermissions.map((permission) => {
      const parts = permission.split(':');
      return { action: parts[0], module: parts[1] };
    });
    const userPermissions = user.roles[0]?.permissions.map((per) => per.name);

    if (!userPermissions || userPermissions.length === 0) {
      throw new UnauthorizedException('No permissions assigned to the user');
    }

    for (const required of requiredModules) {
      const { action, module } = required;

      const requiredPermission = `${action}:${module}`;
      console.log(requiredPermission, 'requiredPermission');

      const userHasPermission = userPermissions.includes(requiredPermission);
      console.log(userHasPermission, 'userHasPermission');

      if (!userHasPermission) {
        throw new BadRequestException(
          `${action} permission not granted for ${module}`,
        );
      }
    }

    return true;
  }
}
