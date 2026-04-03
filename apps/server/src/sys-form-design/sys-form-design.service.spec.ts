import { Test, TestingModule } from '@nestjs/testing';

import { SysFormDesignService } from './sys-form-design.service';

describe('sysFormDesignService', () => {
  let service: SysFormDesignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysFormDesignService],
    }).compile();

    service = module.get<SysFormDesignService>(SysFormDesignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
