import type { Request } from 'express';

import { Controller, Get, Req } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';

@Controller('user')
export class AppUserController {
  constructor(private readonly authService: AuthService) {}

  @Get('info')
  async getUserInfo(@Req() request: Request) {
    const accessToken = this.authService.getBearerToken(request);
    return this.authService.getUserInfoFromAccessToken(accessToken);
  }
}
