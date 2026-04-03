import type { Request } from 'express';

import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Controller, Get, Param, Query, Req } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { LegacySqlService } from './legacy-sql.service';

type RequestWithContext = Request & {
  requestContext?: AppRequestContext;
};

@Controller('legacy-sql')
export class LegacySqlController {
  constructor(
    private readonly legacySqlService: LegacySqlService,
    private readonly authService: AuthService,
  ) {}

  @Get('status')
  getStatus() {
    return this.legacySqlService.getStatus();
  }

  @Get('queries')
  listNamedQueries() {
    return this.legacySqlService.listNamedQueries();
  }

  @Get('queries/:key')
  getNamedQuery(@Param('key') key: string) {
    return this.legacySqlService.getNamedQuery(key);
  }

  @Get('queries/:key/execute')
  async executeNamedQuery(
    @Param('key') key: string,
    @Query('billNo') billNo?: string,
    @Query('flowNo') flowNo?: string,
    @Query('indicatorCode') indicatorCode?: string,
    @Query('keyword') keyword?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('queryType') queryType?: string,
    @Query('status') status?: string,
    @Query('userId') userId?: string,
    @Req() request?: RequestWithContext,
  ) {
    const requestContext = request?.requestContext;
    return this.legacySqlService.executeNamedQuery(key, {
      billNo,
      fiscalYear: requestContext?.fiscalYear,
      flowNo,
      indicatorCode,
      keyword,
      page,
      pageSize,
      queryType,
      status,
      tenantId: requestContext?.tenantId,
      userId: userId || (await this.resolveUserId(request)),
    });
  }

  @Get('ping')
  async ping() {
    return this.legacySqlService.ping();
  }

  private async resolveUserId(request?: RequestWithContext) {
    if (!request) {
      return undefined;
    }

    try {
      const accessToken = this.authService.getBearerToken(request);
      const userInfo = await this.authService.getUserInfoFromAccessToken(accessToken);
      return userInfo.userId;
    } catch {
      return undefined;
    }
  }
}
