import { Test, TestingModule } from '@nestjs/testing';
import { SysUserService } from './sys-user.service';

describe('SysUserService', () => {
  let service: SysUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysUserService],
    }).compile();

    service = module.get<SysUserService>(SysUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
