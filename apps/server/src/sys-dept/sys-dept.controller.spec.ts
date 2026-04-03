import { Test, TestingModule } from '@nestjs/testing';

import { SysDeptController } from './sys-dept.controller';

describe('sysDeptController', () => {
  let controller: SysDeptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysDeptController],
    }).compile();

    controller = module.get<SysDeptController>(SysDeptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
