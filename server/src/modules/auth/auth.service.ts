import { Injectable } from '@nestjs/common'

const fakeUserInfo = {
  userId: '1',
  username: 'vben',
  realName: 'Vben Admin',
  desc: 'manager',
  password: '123456',
  token: 'fakeToken1',
  roles: [
    {
      roleName: 'Super Admin',
      value: 'super',
    },
  ],
}

@Injectable()
export class AuthService {
  constructor() {}

  async login() {
    return fakeUserInfo
  }

  async getUserInfoById() {
    return fakeUserInfo
  }
}
