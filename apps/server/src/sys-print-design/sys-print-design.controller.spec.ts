import { Test, TestingModule } from '@nestjs/testing';

import { SysPrintDesignController } from './sys-print-design.controller';

describe('sysPrintDesignController', () => {
  let controller: SysPrintDesignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysPrintDesignController],
    }).compile();

    controller = module.get<SysPrintDesignController>(SysPrintDesignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
