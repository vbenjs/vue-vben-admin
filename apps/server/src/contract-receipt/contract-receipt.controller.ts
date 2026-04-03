import type { Request } from 'express';

import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { RequestContext } from '../common/request-context/request-context.decorator';
import { ContractReceiptService } from './contract-receipt.service';

type RequestWithContext = Request & {
  requestContext?: AppRequestContext;
};

@Controller('contract-receipt')
export class ContractReceiptController {
  constructor(
    private readonly authService: AuthService,
    private readonly contractReceiptService: ContractReceiptService,
  ) {}

  @Post()
  async create(@Body() data: any, @RequestContext() requestContext: AppRequestContext) {
    return this.contractReceiptService.create(data, 'admin', requestContext);
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @Req() request?: RequestWithContext) {
    return this.contractReceiptService.submit(BigInt(id), await this.resolveActor(request));
  }

  @Post(':id/withdraw')
  async withdraw(@Param('id') id: string, @Req() request?: RequestWithContext) {
    return this.contractReceiptService.withdraw(BigInt(id), await this.resolveActor(request));
  }

  @Get(':id/history')
  async getHistory(@Param('id') id: string) {
    return this.contractReceiptService.getHistory(BigInt(id));
  }

  @Get('list')
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('contractName') contractName?: string,
    @Query('receiptNo') receiptNo?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('flowStatus') flowStatus?: string,
    @Query('status') status?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.contractReceiptService.findAll(
      {
        contractName,
        fiscalYear,
        flowStatus,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        receiptNo,
        status,
      },
      requestContext,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contractReceiptService.findOne(BigInt(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @RequestContext() requestContext: AppRequestContext,
  ) {
    return this.contractReceiptService.update(BigInt(id), data, 'admin', requestContext);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.contractReceiptService.remove(BigInt(id));
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
