import { Test, TestingModule } from '@nestjs/testing';
import { SysApprovalProcessController } from './sys-approval-process.controller';

describe('SysApprovalProcessController', () => {
  let controller: SysApprovalProcessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysApprovalProcessController],
    }).compile();

    controller = module.get<SysApprovalProcessController>(SysApprovalProcessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
