import { Test, TestingModule } from '@nestjs/testing';

import { SysMenuController } from './sys-menu.controller';

describe('sysMenuController', () => {
  let controller: SysMenuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysMenuController],
    }).compile();

    controller = module.get<SysMenuController>(SysMenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
