import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { AppUserController } from './app-user.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppUserController],
})
export class AppUserModule {}
