import { Module } from '@nestjs/common';
import { ResetcodeService } from './resetcode.service';
import { ResetcodeController } from './resetcode.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ResetCode, ResetCodeSchema } from './schemas/resetcode.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: ResetCode.name, schema: ResetCodeSchema }],
      process.env.DATABASE_NAME,
    ),
  ],
  controllers: [ResetcodeController],
  providers: [ResetcodeService],
})
export class ResetcodeModule {}
