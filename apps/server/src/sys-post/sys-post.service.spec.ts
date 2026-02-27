import { Test, TestingModule } from '@nestjs/testing';
import { SysPostService } from './sys-post.service';

describe('SysPostService', () => {
  let service: SysPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysPostService],
    }).compile();

    service = module.get<SysPostService>(SysPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
