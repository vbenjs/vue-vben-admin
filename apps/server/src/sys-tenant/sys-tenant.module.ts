import { Module } from '@nestjs/common';
import { SysTenantController } from './sys-tenant.controller';
import { SysTenantService } from './sys-tenant.service';

@Module({
  controllers: [SysTenantController],
  providers: [SysTenantService]
})
export class SysTenantModule {}
