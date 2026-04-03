import type { Request } from 'express';

import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { RequestContext } from '../common/request-context/request-context.decorator';
import { ResearchScopeAdjustService } from './research-scope-adjust.service';

type RequestWithContext = Request & {
  requestContext?: AppRequestContext;
};

@Controller('research/scope-adjust')
export class ResearchScopeAdjustController {
  constructor(
    private readonly authService: AuthService,
    private readonly researchScopeAdjustService: ResearchScopeAdjustService,
  ) {}

  @Post()
  async create(@Body() data: any, @RequestContext() requestContext: AppRequestContext) {
    return this.researchScopeAdjustService.create(data, 'admin', requestContext);
  }

  @Get('list')
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('indicatorName') indicatorName?: string,
    @Query('outScopeName') outScopeName?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('flowStatus') flowStatus?: string,
    @Query('status') status?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.researchScopeAdjustService.findAll(
      {
        fiscalYear,
        flowStatus,
        indicatorName,
        outScopeName,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        status,
      },
      requestContext,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.researchScopeAdjustService.findOne(BigInt(id));
  }

  @Get(':id/history')
  async getHistory(@Param('id') id: string) {
    return this.researchScopeAdjustService.getHistory(BigInt(id));
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @Req() request?: RequestWithContext) {
    return this.researchScopeAdjustService.submit(BigInt(id), await this.resolveActor(request));
  }

  @Post(':id/withdraw')
  async withdraw(@Param('id') id: string, @Req() request?: RequestWithContext) {
    return this.researchScopeAdjustService.withdraw(BigInt(id), await this.resolveActor(request));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @RequestContext() requestContext: AppRequestContext,
  ) {
    return this.researchScopeAdjustService.update(BigInt(id), data, 'admin', requestContext);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.researchScopeAdjustService.remove(BigInt(id));
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
