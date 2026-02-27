import { Module } from '@nestjs/common';
import { SysMenuController } from './sys-menu.controller';
import { SysMenuService } from './sys-menu.service';

@Module({
  controllers: [SysMenuController],
  providers: [SysMenuService]
})
export class SysMenuModule {}
