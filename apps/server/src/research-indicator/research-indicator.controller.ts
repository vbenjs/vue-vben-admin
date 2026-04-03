import type { Request } from 'express';

import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { RequestContext } from '../common/request-context/request-context.decorator';
import { ResearchIndicatorService } from './research-indicator.service';

type RequestWithContext = Request & {
  requestContext?: AppRequestContext;
};

@Controller('research/indicator')
export class ResearchIndicatorController {
  constructor(
    private readonly authService: AuthService,
    private readonly researchIndicatorService: ResearchIndicatorService,
  ) {}

  @Post()
  async create(@Body() data: any, @RequestContext() requestContext: AppRequestContext) {
    return this.researchIndicatorService.create(data, 'admin', requestContext);
  }

  @Get('list')
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('projectName') projectName?: string,
    @Query('indicatorName') indicatorName?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('flowStatus') flowStatus?: string,
    @Query('status') status?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.researchIndicatorService.findAll(
      {
        fiscalYear,
        flowStatus,
        indicatorName,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        projectName,
        status,
      },
      requestContext,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.researchIndicatorService.findOne(BigInt(id));
  }

  @Get(':id/history')
  async getHistory(@Param('id') id: string) {
    return this.researchIndicatorService.getHistory(BigInt(id));
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @Req() request?: RequestWithContext) {
    return this.researchIndicatorService.submit(BigInt(id), await this.resolveActor(request));
  }

  @Post(':id/withdraw')
  async withdraw(@Param('id') id: string, @Req() request?: RequestWithContext) {
    return this.researchIndicatorService.withdraw(BigInt(id), await this.resolveActor(request));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @RequestContext() requestContext: AppRequestContext,
  ) {
    return this.researchIndicatorService.update(BigInt(id), data, 'admin', requestContext);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.researchIndicatorService.remove(BigInt(id));
  }

  private async resolveActor(request?: RequestWithContext) {
    if (!request) {
      return {};
    }

    try {
      const accessToken = this.authService.getBearerToken(request);
      const userInfo = await this.authService.getUserInfoFromAccessToken(accessToken);
      return {
        realName: userInfo.realName,
        userId: userInfo.userId,
        username: userInfo.username,
      };
    } catch {
      return {};
    }
  }
}
