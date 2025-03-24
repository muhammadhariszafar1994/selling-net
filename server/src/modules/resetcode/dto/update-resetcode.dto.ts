import { PartialType } from '@nestjs/swagger';
import { CreateResetcodeDto } from './create-resetcode.dto';

export class UpdateResetcodeDto extends PartialType(CreateResetcodeDto) {}
