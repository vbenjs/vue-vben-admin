import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface UserInfo {
  id: number;
  password: string;
  realName: string;
  roles: string[];
  username: string;
}

@Injectable()
export class AuthService {
  // TODO: Replace with your own secret key
  static ACCESS_TOKEN_SECRET = 'access_token_secret';
  static MOCK_CODES = [
    // super
    {
      codes: ['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010'],
      username: 'vben',
    },
    {
      // admin
      codes: ['AC_100010', 'AC_100020', 'AC_100030'],
      username: 'admin',
    },
    {
      // user
      codes: ['AC_1000001', 'AC_1000002'],
      username: 'jack',
    },
  ];
  static MOCK_USERS: UserInfo[] = [
    {
      id: 0,
      password: '123456',
      realName: 'Vben',
      roles: ['super'],
      username: 'vben',
    },
    {
      id: 1,
      password: '123456',
      realName: 'Admin',
      roles: ['admin'],
      username: 'admin',
    },
    {
      id: 2,
      password: '123456',
      realName: 'Jack',
      roles: ['user'],
      username: 'jack',
    },
  ];
  static REFRESH_TOKEN_SECRET = 'refresh_token_secret';

  constructor(private readonly JwtService: JwtService) {}

  public getAccessToken(user: UserInfo) {
    return this.JwtService.sign(user, {
      expiresIn: '7d',
    });
  }

  public getRefreshToken(user: UserInfo) {
    return this.JwtService.sign(user, {
      expiresIn: '30d',
    });
  }

  public async validateUser(username: string, password: string) {
    const findUser = AuthService.MOCK_USERS.find(
      (item) => item.username === username && item.password === password,
    );

    if (!findUser) {
      return;
    }

    return findUser;
  }
}

declare global {
  export namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface User extends UserInfo {}
  }
}
