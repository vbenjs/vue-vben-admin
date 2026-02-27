import { Test, TestingModule } from '@nestjs/testing';
import { SysApprovalProcessService } from './sys-approval-process.service';

describe('SysApprovalProcessService', () => {
  let service: SysApprovalProcessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysApprovalProcessService],
    }).compile();

    service = module.get<SysApprovalProcessService>(SysApprovalProcessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
