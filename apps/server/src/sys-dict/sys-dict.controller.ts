import { Controller, Get, Param } from '@nestjs/common';
import { SysDictService } from './sys-dict.service';

@Controller('sys/dict')
export class SysDictController {
  constructor(private readonly sysDictService: SysDictService) {}

  @Get('data/type/:dictType')
  async getByType(@Param('dictType') dictType: string) {
    return this.sysDictService.getDictDataByType(dictType);
  }
}
