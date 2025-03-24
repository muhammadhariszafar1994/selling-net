import { Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { ResetcodeService } from './resetcode.service';
// import { CreateResetcodeDto } from './dto/create-resetcode.dto';
// import { UpdateResetcodeDto } from './dto/update-resetcode.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Resetcode')
@Controller('resetcode')
export class ResetcodeController {
  constructor(private readonly resetcodeService: ResetcodeService) {}

  @Post()
  // create(@Body() createResetcodeDto: CreateResetcodeDto) {
  //   return this.resetcodeService.create(createResetcodeDto);
  // }
  @Get()
  findAll() {
    return this.resetcodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resetcodeService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateResetcodeDto: UpdateResetcodeDto,
  // ) {
  //   return this.resetcodeService.update(+id, updateResetcodeDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resetcodeService.remove(+id);
  }
}
