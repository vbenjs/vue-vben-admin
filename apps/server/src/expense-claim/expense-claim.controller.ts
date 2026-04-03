import type { Request } from 'express';

import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { RequestContext } from '../common/request-context/request-context.decorator';
import { ExpenseClaimService } from './expense-claim.service';

type RequestWithContext = Request & {
  requestContext?: AppRequestContext;
};

@Controller('expense-claim')
export class ExpenseClaimController {
  constructor(
    private readonly authService: AuthService,
    private readonly expenseClaimService: ExpenseClaimService,
  ) {}

  @Post()
  async create(@Body() data: any, @RequestContext() requestContext: AppRequestContext) {
    return this.expenseClaimService.create(data, 'admin', requestContext);
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @Req() request?: RequestWithContext) {
    return this.expenseClaimService.submit(BigInt(id), await this.resolveActor(request));
  }

  @Post(':id/withdraw')
  async withdraw(@Param('id') id: string, @Req() request?: RequestWithContext) {
    return this.expenseClaimService.withdraw(BigInt(id), await this.resolveActor(request));
  }

  @Get(':id/history')
  async getHistory(@Param('id') id: string) {
    return this.expenseClaimService.getHistory(BigInt(id));
  }

  @Get('list')
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('claimNo') claimNo?: string,
    @Query('applicant') applicant?: string,
    @Query('claimType') claimType?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('flowStatus') flowStatus?: string,
    @Query('status') status?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.expenseClaimService.findAll(
      {
        applicant,
        claimNo,
        claimType,
        fiscalYear,
        flowStatus,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        status,
      },
      requestContext,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.expenseClaimService.findOne(BigInt(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @RequestContext() requestContext: AppRequestContext,
  ) {
    return this.expenseClaimService.update(BigInt(id), data, 'admin', requestContext);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.expenseClaimService.remove(BigInt(id));
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
