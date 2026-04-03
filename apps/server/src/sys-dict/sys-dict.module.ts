import { Module } from '@nestjs/common';

import { SysDictController } from './sys-dict.controller';
import { SysDictService } from './sys-dict.service';

@Module({
  controllers: [SysDictController],
  providers: [SysDictService],
})
export class SysDictModule {}
