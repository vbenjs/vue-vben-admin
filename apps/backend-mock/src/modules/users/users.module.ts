import { UserEntity } from '@/models/entity/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';

@Module({
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService],
})
export class UsersModule {}
