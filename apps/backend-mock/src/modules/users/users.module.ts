import { Module } from '@nestjs/common';

import { MockModule } from '../mock/mock.module';
import { UsersService } from './users.service';

@Module({
  exports: [UsersService],
  imports: [MockModule],
  providers: [UsersService],
})
export class UsersModule {}
