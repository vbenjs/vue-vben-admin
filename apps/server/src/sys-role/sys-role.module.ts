import { Module } from '@nestjs/common';
import { SysRoleController } from './sys-role.controller';
import { SysRoleService } from './sys-role.service';

@Module({
  controllers: [SysRoleController],
  providers: [SysRoleService]
})
export class SysRoleModule {}
