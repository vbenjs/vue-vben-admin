import type { Request } from 'express';

import { Controller, Get, Req } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { SYSTEM_PLATFORM_MENUS } from './system-platform-menus';

@Controller('menu')
export class AppMenuController {
  constructor(private readonly authService: AuthService) {}

  @Get('all')
  async getAllMenus(@Req() request: Request) {
    const accessToken = this.authService.getBearerToken(request);
    await this.authService.getUserInfoFromAccessToken(accessToken);
    return SYSTEM_PLATFORM_MENUS;
  }
}
