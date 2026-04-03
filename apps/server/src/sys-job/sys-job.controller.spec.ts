import { Test, TestingModule } from '@nestjs/testing';

import { SysJobController } from './sys-job.controller';

describe('sysJobController', () => {
  let controller: SysJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysJobController],
    }).compile();

    controller = module.get<SysJobController>(SysJobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
