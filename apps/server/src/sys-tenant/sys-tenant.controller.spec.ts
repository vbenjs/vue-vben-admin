import { Test, TestingModule } from '@nestjs/testing';
import { SysTenantController } from './sys-tenant.controller';

describe('SysTenantController', () => {
  let controller: SysTenantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysTenantController],
    }).compile();

    controller = module.get<SysTenantController>(SysTenantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
