import { Test, TestingModule } from '@nestjs/testing';

import { SysDocCodeController } from './sys-doc-code.controller';

describe('sysDocCodeController', () => {
  let controller: SysDocCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysDocCodeController],
    }).compile();

    controller = module.get<SysDocCodeController>(SysDocCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
