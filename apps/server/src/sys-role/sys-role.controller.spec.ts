import { Test, TestingModule } from '@nestjs/testing';
import { SysRoleController } from './sys-role.controller';

describe('SysRoleController', () => {
  let controller: SysRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysRoleController],
    }).compile();

    controller = module.get<SysRoleController>(SysRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
