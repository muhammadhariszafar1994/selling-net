import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from 'src/modules/user/schemas/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { jwtConstants } from './constants';
import {
  ResetCode,
  ResetCodeSchema,
} from 'src/modules/resetcode/schemas/resetcode.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { DatabaseModule } from 'src/database/database.module';
import { Role, RoleSchema } from '../role/schemas/roles.schema';
import {
  Permission,
  PermissionSchema,
} from '../permissions/schemas/permission.schema';


@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: ResetCode.name, schema: ResetCodeSchema },
        { name: Role.name, schema: RoleSchema },
        { name: Permission.name, schema: PermissionSchema }
      ], 'DATABASE_CONNECTION'
    ),
    DatabaseModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const filename: string = file.originalname.split('.')[0];
          const fileExtname: string = extname(file.originalname);
          callback(null, `${filename}-${Date.now()}${fileExtname}`);
        },
      }),
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT, 10),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: process.env.MAIL_FROM_ADDRESS || 'No Reply <noreply@example.com>',
      },
      preview: true,
      // template: {
      //   dir: join(__dirname, 'templates'),
      //   // adapter: new PugAdapter(),
      //   adapter: new HandlebarsAdapter(), // or another adapter
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
    ConfigModule.forRoot({
      isGlobal: true, // This makes the configuration globally available
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
