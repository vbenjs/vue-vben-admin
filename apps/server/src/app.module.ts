import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { SysConfigModule } from './sys-config/sys-config.module';
import { SysDictModule } from './sys-dict/sys-dict.module';
import { SysDeptModule } from './sys-dept/sys-dept.module';
import { SysRoleModule } from './sys-role/sys-role.module';
import { SysMenuModule } from './sys-menu/sys-menu.module';
import { SysUserModule } from './sys-user/sys-user.module';
import { SysPostModule } from './sys-post/sys-post.module';
import { SysTenantModule } from './sys-tenant/sys-tenant.module';
import { SysOperLogModule } from './sys-oper-log/sys-oper-log.module';
import { SysLogininforModule } from './sys-logininfor/sys-logininfor.module';
import { SysJobModule } from './sys-job/sys-job.module';
import { SysDocCodeModule } from './sys-doc-code/sys-doc-code.module';
import { SysFormDesignModule } from './sys-form-design/sys-form-design.module';
import { SysApprovalProcessModule } from './sys-approval-process/sys-approval-process.module';
import { SysPrintDesignModule } from './sys-print-design/sys-print-design.module';

@Module({
  imports: [PrismaModule, RedisModule, SysConfigModule, SysDictModule, SysDeptModule, SysRoleModule, SysMenuModule, SysUserModule, SysPostModule, SysTenantModule, SysOperLogModule, SysLogininforModule, SysJobModule, SysDocCodeModule, SysFormDesignModule, SysApprovalProcessModule, SysPrintDesignModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
