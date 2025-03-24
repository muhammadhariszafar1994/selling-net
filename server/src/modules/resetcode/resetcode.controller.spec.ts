import { Test, TestingModule } from '@nestjs/testing';
import { ResetcodeController } from './resetcode.controller';
import { ResetcodeService } from './resetcode.service';

describe('ResetcodeController', () => {
  let controller: ResetcodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResetcodeController],
      providers: [ResetcodeService],
    }).compile();

    controller = module.get<ResetcodeController>(ResetcodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
