import { Test, TestingModule } from '@nestjs/testing';

import { SysPrintDesignService } from './sys-print-design.service';

describe('sysPrintDesignService', () => {
  let service: SysPrintDesignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysPrintDesignService],
    }).compile();

    service = module.get<SysPrintDesignService>(SysPrintDesignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
