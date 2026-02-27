import { Test, TestingModule } from '@nestjs/testing';
import { SysFormDesignController } from './sys-form-design.controller';

describe('SysFormDesignController', () => {
  let controller: SysFormDesignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysFormDesignController],
    }).compile();

    controller = module.get<SysFormDesignController>(SysFormDesignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
