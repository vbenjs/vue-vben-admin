import { Test, TestingModule } from '@nestjs/testing';
import { SysDocCodeService } from './sys-doc-code.service';

describe('SysDocCodeService', () => {
  let service: SysDocCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysDocCodeService],
    }).compile();

    service = module.get<SysDocCodeService>(SysDocCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
