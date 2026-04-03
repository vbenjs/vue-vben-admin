import { Test, TestingModule } from '@nestjs/testing';

import { SysLogininforController } from './sys-logininfor.controller';

describe('sysLogininforController', () => {
  let controller: SysLogininforController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysLogininforController],
    }).compile();

    controller = module.get<SysLogininforController>(SysLogininforController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
