import { Test, TestingModule } from '@nestjs/testing';

import { SysOperLogService } from './sys-oper-log.service';

describe('sysOperLogService', () => {
  let service: SysOperLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysOperLogService],
    }).compile();

    service = module.get<SysOperLogService>(SysOperLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
