import type { RefreshTokenDto } from '@/models/dto/auth.dto';

import { Public } from '@/core/decorator';
import { LocalAuthGuard } from '@/core/guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 获取用户权限码
   * @param req
   */
  @Get('getAccessCodes')
  @HttpCode(HttpStatus.OK)
  async getAccessCodes(@Request() req: Request) {
    return await this.authService.getAccessCodes(req.user.username);
  }

  /**
   * 获取用户信息
   * @param req
   */
  @Get('getUserInfo')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req: Request) {
    return await this.authService.getUserInfo(req.user.username);
  }

  /**
   * 用户登录
   * @param req
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: Request) {
    return await this.authService.login(req.user);
  }

  @Post('refreshToken')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }
}
