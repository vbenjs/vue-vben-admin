import type { UserInfo } from '#/auth';

import {
  All,
  Controller,
  ForbiddenException,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '#/auth';
import { Public } from '#/guards';
import { Cookies } from '#/plugins';
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from '#/utils/cookie-utils';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly AuthService: AuthService,
    private readonly JwtService: JwtService,
  ) {}

  @All('codes')
  public codes(@Request() req: Express.Request) {
    const codes = AuthService.MOCK_CODES.find(
      (item) => item.username === (req.user as Express.User).username,
    )?.codes;

    return codes ?? [];
  }

  @UseGuards(AuthGuard('local'))
  @Public()
  @Post('login')
  public login(@Request() req: Express.Request, @Response() res: any) {
    // 生成令牌
    const accessToken = this.AuthService.getAccessToken(
      req.user as Express.User,
    );
    const refreshToken = this.AuthService.getRefreshToken(
      req.user as Express.User,
    );

    setRefreshTokenCookie(res, refreshToken);

    return { accessToken };
  }

  @Post('logout')
  public logout(@Response() res: any, @Cookies('jwt') refreshToken?: string) {
    if (!refreshToken) {
      return '';
    }

    clearRefreshTokenCookie(res);

    return '';
  }

  @Post('refresh')
  public refresh(@Response() res: any, @Cookies('jwt') refreshToken?: string) {
    if (!refreshToken) {
      throw new ForbiddenException();
    }

    clearRefreshTokenCookie(res);

    const userinfo = this.JwtService.verify<UserInfo>(refreshToken);
    if (!userinfo) {
      throw new ForbiddenException();
    }

    const findUser = AuthService.MOCK_USERS.find(
      (item) => item.username === userinfo.username,
    );
    if (!findUser) {
      throw new ForbiddenException();
    }
    const accessToken = this.AuthService.getAccessToken(findUser);

    setRefreshTokenCookie(res, refreshToken);

    return accessToken;
  }
}

export default AuthController;
