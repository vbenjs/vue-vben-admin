import type { UserEntity } from '@/models/entity/user.entity';
import type { JwtConfig } from '@/types';

import { UsersService } from '@/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * get user info
   * @param username
   */
  async getAccessCodes(username: string): Promise<string[]> {
    const user = await this.usersService.findOne(username);

    const mockCodes = [
      // super
      {
        codes: ['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010'],
        userId: 0,
      },
      {
        // admin
        codes: ['AC_100010', 'AC_100020', 'AC_100030'],
        userId: 1,
      },
      {
        // user
        codes: ['AC_1000001', 'AC_1000002'],
        userId: 2,
      },
    ];

    return mockCodes.find((item) => item.userId === user.id)?.codes ?? [];
  }

  async getUserInfo(username: string): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.usersService.findOne(username);
    const { password: _pass, ...userInfo } = user;
    return userInfo;
  }

  /**
   * user login
   */
  async login(userEntity: UserEntity): Promise<any> {
    const { id, roles, username } = userEntity;

    const payload = { id, roles, username };
    const { refreshSecret, refreshexpiresIn } =
      this.configService.get<JwtConfig>('jwt');
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: refreshexpiresIn,
        secret: refreshSecret,
      }),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<JwtConfig>('jwt').refreshSecret,
      });
      const user = await this.usersService.findOne(payload.username);
      if (!user) {
        throw new UnauthorizedException();
      }
      return this.login(user);
    } catch {
      throw new UnauthorizedException();
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      // 使用 bcrypt.compare 验证密码
      const { password: _pass, ...result } = user;
      return result;
    }
    return null;
  }
}
