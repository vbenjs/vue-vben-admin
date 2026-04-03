import type { Request, Response } from 'express';

import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login-context')
  async getLoginContext() {
    return this.authService.getLoginContext();
  }

  @Post('login')
  async login(
    @Body()
    body: {
      fiscalYear?: string;
      password?: string;
      tenantId?: number | string;
      username?: string;
    },
    @Res({ passthrough: true }) response: Response,
  ) {
    const { fiscalYear = '', password = '', tenantId, username = '' } = body || {};
    const { accessToken, refreshToken } = await this.authService.login({
      fiscalYear,
      password,
      tenantId,
      username,
    });
    this.authService.setRefreshTokenCookie(response, refreshToken);
    return { accessToken };
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    const refreshToken = this.authService.getRefreshTokenFromRequest(request);
    const accessToken = await this.authService.refresh(refreshToken);
    this.authService.setRefreshTokenCookie(response, refreshToken);
    response.status(200).send(accessToken);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    this.authService.clearRefreshTokenCookie(response);
    return '';
  }

  @Get('codes')
  async getAccessCodes(@Req() request: Request) {
    const accessToken = this.authService.getBearerToken(request);
    return this.authService.getAccessCodesFromAccessToken(accessToken);
  }
}
