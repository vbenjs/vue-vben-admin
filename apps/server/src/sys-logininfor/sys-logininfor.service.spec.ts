import { Test, TestingModule } from '@nestjs/testing';
import { SysLogininforService } from './sys-logininfor.service';

describe('SysLogininforService', () => {
  let service: SysLogininforService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysLogininforService],
    }).compile();

    service = module.get<SysLogininforService>(SysLogininforService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
