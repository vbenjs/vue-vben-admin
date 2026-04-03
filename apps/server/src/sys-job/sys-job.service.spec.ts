import { Test, TestingModule } from '@nestjs/testing';

import { SysJobService } from './sys-job.service';

describe('sysJobService', () => {
  let service: SysJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysJobService],
    }).compile();

    service = module.get<SysJobService>(SysJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
