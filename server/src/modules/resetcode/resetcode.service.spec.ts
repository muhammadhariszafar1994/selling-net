import { Test, TestingModule } from '@nestjs/testing';
import { ResetcodeService } from './resetcode.service';

describe('ResetcodeService', () => {
  let service: ResetcodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResetcodeService],
    }).compile();

    service = module.get<ResetcodeService>(ResetcodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
