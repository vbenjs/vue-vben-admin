import type { Request } from 'express';

import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { RequestContext } from '../common/request-context/request-context.decorator';
import { FinanceWorkflowService } from './finance-workflow.service';

type RequestWithContext = Request & {
  requestContext?: AppRequestContext;
};

@Controller('finance/workflow')
export class FinanceWorkflowController {
  constructor(
    private readonly authService: AuthService,
    private readonly financeWorkflowService: FinanceWorkflowService,
  ) {}

  @Post('command/:action')
  async executeCommand(
    @Param('action') action: 'add-sign' | 'approve' | 'reject' | 'remind' | 'submit' | 'withdraw',
    @Body()
    body: {
      businessId?: number | string;
      businessNo?: string;
      businessType?: string;
      currentNode?: string;
      flowNo?: string;
      nodeCode?: string;
      opinion?: string;
      title?: string;
    },
    @Req() request?: RequestWithContext,
  ) {
    return this.financeWorkflowService.executeCommand(
      action,
      body || {},
      await this.resolveActor(request),
    );
  }

  @Get('history')
  getHistory(@Query('businessNo') businessNo?: string, @Query('flowNo') flowNo?: string) {
    return this.financeWorkflowService.getHistory({ businessNo, flowNo });
  }

  @Get('workbench/list')
  async getWorkbenchList(
    @Query('flowNo') flowNo?: string,
    @Query('keyword') keyword?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('queryType') queryType?: string,
    @Query('status') status?: string,
    @Query('userId') userId?: string,
    @Query('businessCategory') businessCategory?: string,
    @RequestContext() requestContext?: AppRequestContext,
    @Req() request?: RequestWithContext,
  ) {
    return this.financeWorkflowService.getWorkbenchList(
      {
        businessCategory,
        flowNo,
        keyword,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 30,
        queryType,
        status,
        userId: userId || (await this.resolveUserId(request)),
      },
      requestContext,
    );
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

  private async resolveUserId(request?: RequestWithContext) {
    const actor = await this.resolveActor(request);
    return actor.userId;
  }
}
