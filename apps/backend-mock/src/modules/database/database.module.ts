import { UserEntity } from '@/models/entity/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { DatabaseService } from './database.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [DatabaseService],
})
export class DatabaseModule {}
