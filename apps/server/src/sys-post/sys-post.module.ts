import { Module } from '@nestjs/common';
import { SysPostController } from './sys-post.controller';
import { SysPostService } from './sys-post.service';

@Module({
  controllers: [SysPostController],
  providers: [SysPostService]
})
export class SysPostModule {}
