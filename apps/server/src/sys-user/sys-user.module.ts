import { Module } from '@nestjs/common';
import { SysUserController } from './sys-user.controller';
import { SysUserService } from './sys-user.service';

@Module({
  controllers: [SysUserController],
  providers: [SysUserService]
})
export class SysUserModule {}
