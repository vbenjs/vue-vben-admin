import type { CreateUserDto } from '@/models/dto/user.dto';
import type { Repository } from 'typeorm';

import { UserEntity } from '@/models/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(user: CreateUserDto): Promise<UserEntity> {
    user.password = await bcrypt.hash(user.password, 10); // 密码哈希
    return this.usersRepository.save(user);
  }

  /**
   * Find user by username
   * @param username
   */
  async findOne(username: string): Promise<UserEntity | undefined> {
    return await this.usersRepository.findOne({ where: { username } });
  }
}
