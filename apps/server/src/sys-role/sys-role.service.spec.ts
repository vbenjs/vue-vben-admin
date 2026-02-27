import { Test, TestingModule } from '@nestjs/testing';
import { SysRoleService } from './sys-role.service';

describe('SysRoleService', () => {
  let service: SysRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysRoleService],
    }).compile();

    service = module.get<SysRoleService>(SysRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
