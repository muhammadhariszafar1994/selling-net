import { Injectable } from '@nestjs/common';
// import { CreateResetcodeDto } from './dto/create-resetcode.dto';
// import { UpdateResetcodeDto } from './dto/update-resetcode.dto';
// import { CreateResetcodeDto } from './dto/create-resetcode.dto';
// import { UpdateResetcodeDto } from './dto/update-resetcode.dto';
// import { CreateResetcodeDto } from './dto/create-resetcode.dto';
// import { UpdateResetcodeDto } from './dto/update-resetcode.dto';
// import { CreateResetcodeDto } from './dto/create-resetcode.dto';
// import { UpdateResetcodeDto } from './dto/update-resetcode.dto';

@Injectable()
export class ResetcodeService {
  // create(createResetcodeDto: CreateResetcodeDto) {
  //   throw new Error('Method not implemented.');
  // }
  // update(arg0: number, updateResetcodeDto: UpdateResetcodeDto) {
  //   throw new Error('Method not implemented.');
  // }
  // create(createResetcodeDto: CreateResetcodeDto) {
  //   throw new Error('Method not implemented.');
  // }
  // update(arg0: number, updateResetcodeDto: UpdateResetcodeDto) {
  //   throw new Error('Method not implemented.');
  // }
  // create(createResetcodeDto: CreateResetcodeDto) {
  //   throw new Error('Method not implemented.');
  // }
  // update(arg0: number, updateResetcodeDto: UpdateResetcodeDto) {
  //   throw new Error('Method not implemented.');
  // }
  // create(createResetcodeDto: CreateResetcodeDto) {
  //   return 'This action adds a new resetcode';
  // }

  findAll() {
    return `This action returns all resetcode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resetcode`;
  }

  // update(id: number, updateResetcodeDto: UpdateResetcodeDto) {
  //   return `This action updates a #${id} resetcode`;
  // }

  remove(id: number) {
    return `This action removes a #${id} resetcode`;
  }
}
