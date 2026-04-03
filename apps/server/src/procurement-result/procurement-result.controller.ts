import type { Request } from 'express';

import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { RequestContext } from '../common/request-context/request-context.decorator';

import { ProcurementResultService } from './procurement-result.service';

type RequestWithContext = Request & {
  requestContext?: AppRequestContext;
};

@Controller('procurement-result')
export class ProcurementResultController {
  constructor(
    private readonly authService: AuthService,
    private readonly procurementResultService: ProcurementResultService,
  ) {}

  @Post()
  async create(@Body() data: any) {
    return this.procurementResultService.create(data, 'admin');
  }

  @Get('list')
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('applyNo') applyNo?: string,
    @Query('projectName') projectName?: string,
    @Query('inputStatus') inputStatus?: string,
    @Query('status') status?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.procurementResultService.findAll(
      {
        applyNo,
        fiscalYear,
        inputStatus,
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
    return this.procurementResultService.findOne(BigInt(id));
  }

  @Get(':id/history')
  async getHistory(@Param('id') id: string) {
    return this.procurementResultService.getHistory(BigInt(id));
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @Req() request?: RequestWithContext) {
    return this.procurementResultService.submit(BigInt(id), await this.resolveActor(request));
  }

  @Post(':id/withdraw')
  async withdraw(@Param('id') id: string, @Req() request?: RequestWithContext) {
    return this.procurementResultService.withdraw(BigInt(id), await this.resolveActor(request));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.procurementResultService.update(BigInt(id), data, 'admin');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.procurementResultService.remove(BigInt(id));
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
