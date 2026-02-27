import { Test, TestingModule } from '@nestjs/testing';
import { SysTenantService } from './sys-tenant.service';

describe('SysTenantService', () => {
  let service: SysTenantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysTenantService],
    }).compile();

    service = module.get<SysTenantService>(SysTenantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
