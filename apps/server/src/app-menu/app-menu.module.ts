import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { AppMenuController } from './app-menu.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppMenuController],
})
export class AppMenuModule {}
