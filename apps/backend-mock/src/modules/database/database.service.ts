import type { Repository } from 'typeorm';

import { UserEntity } from '@/models/entity/user.entity';
import { Injectable, type OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersService } from '../users/users.service';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private userService: UsersService,
  ) {}
  async onModuleInit() {
    // data/db.sqlite会被git忽略，方式数据库文件被提交到git
    // 清空表，并初始化两条数据
    await this.usersRepository.clear();

    await this.userService.create({
      id: 0,
      password: '123456',
      realName: 'Administrator',
      roles: ['admin'],
      username: 'vben',
    });

    await this.userService.create({
      id: 1,
      password: '123456',
      realName: 'Jack',
      roles: ['user'],
      username: 'jack',
    });

    const count = await this.usersRepository.count();
    console.log('Database has been initialized with seed data, count:', count);
  }
}
