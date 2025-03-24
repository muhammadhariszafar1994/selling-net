import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/roles.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import {
  Permission,
  PermissionSchema,
} from '../permissions/schemas/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Role.name, schema: RoleSchema },
        { name: Permission.name, schema: PermissionSchema },
      ],
    ),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
