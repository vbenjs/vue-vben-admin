import { UserEntity } from '@/models/entity/user.entity';
import { Injectable } from '@nestjs/common';

import { MockService } from '../mock/mock.service';

@Injectable()
export class UsersService {
  constructor(private mockService: MockService) {}

  /**
   * Find user by username
   * @param username
   */
  async findOne(username: string): Promise<UserEntity | undefined> {
    const allUsers = await this.mockService.findAll('users');
    return allUsers.find((user) => user.username === username);
  }
}
