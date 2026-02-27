import { Test, TestingModule } from '@nestjs/testing';
import { SysMenuService } from './sys-menu.service';

describe('SysMenuService', () => {
  let service: SysMenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysMenuService],
    }).compile();

    service = module.get<SysMenuService>(SysMenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
