import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { SysTenantPolicyController } from './sys-tenant-policy.controller';
import { SysTenantPolicyService } from './sys-tenant-policy.service';

@Module({
  imports: [AuthModule],
  controllers: [SysTenantPolicyController],
  providers: [SysTenantPolicyService],
  exports: [SysTenantPolicyService],
})
export class SysTenantPolicyModule {}
