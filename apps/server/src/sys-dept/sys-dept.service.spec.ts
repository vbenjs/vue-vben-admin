import { Test, TestingModule } from '@nestjs/testing';

import { SysDeptService } from './sys-dept.service';

describe('sysDeptService', () => {
  let service: SysDeptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysDeptService],
    }).compile();

    service = module.get<SysDeptService>(SysDeptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
