import { Test, TestingModule } from '@nestjs/testing';
import { SysPostController } from './sys-post.controller';

describe('SysPostController', () => {
  let controller: SysPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysPostController],
    }).compile();

    controller = module.get<SysPostController>(SysPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
