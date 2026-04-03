import type { Request } from 'express';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { AuthAdjustApplyService } from './auth-adjust-apply.service';

type RequestWithContext = Request & {
  requestContext?: Record<string, unknown>;
};

@Controller('auth-adjust-apply')
export class AuthAdjustApplyController {
  constructor(
    private readonly authService: AuthService,
    private readonly svc: AuthAdjustApplyService,
  ) {}

  @Post()
  async create(@Body() data: any) {
    return this.svc.create(data, 'admin');
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @Req() request?: RequestWithContext) {
    return this.svc.submit(BigInt(id), await this.resolveActor(request));
  }

  @Post(':id/withdraw')
  async withdraw(@Param('id') id: string, @Req() request?: RequestWithContext) {
    return this.svc.withdraw(BigInt(id), await this.resolveActor(request));
  }

  @Get(':id/history')
  async getHistory(@Param('id') id: string) {
    return this.svc.getHistory(BigInt(id));
  }

  @Get('list')
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('indicatorName') indicatorName?: string,
    @Query('applyDeptName') applyDeptName?: string,
    @Query('flowStatus') flowStatus?: string,
    @Query('status') status?: string,
  ) {
    return this.svc.findAll({
      applyDeptName,
      flowStatus,
      indicatorName,
      page: page ? Number.parseInt(page, 10) : 1,
      pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
      status,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.svc.findOne(BigInt(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.svc.update(BigInt(id), data, 'admin');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.svc.remove(BigInt(id));
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
