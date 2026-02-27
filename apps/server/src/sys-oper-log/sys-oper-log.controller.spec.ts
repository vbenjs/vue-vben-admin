import { Test, TestingModule } from '@nestjs/testing';
import { SysOperLogController } from './sys-oper-log.controller';

describe('SysOperLogController', () => {
  let controller: SysOperLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysOperLogController],
    }).compile();

    controller = module.get<SysOperLogController>(SysOperLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
