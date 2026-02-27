import { Module } from '@nestjs/common';
import { SysFormDesignController } from './sys-form-design.controller';
import { SysFormDesignService } from './sys-form-design.service';

@Module({
  controllers: [SysFormDesignController],
  providers: [SysFormDesignService]
})
export class SysFormDesignModule {}
