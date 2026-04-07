import type { Request } from 'express';

import type { AppRequestContext } from '../common/request-context/request-context.types';

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { SysTenantPolicyService } from './sys-tenant-policy.service';

type RequestWithContext = Request & {
  requestContext?: AppRequestContext;
};

@Controller('sys/tenant-policy')
export class SysTenantPolicyController {
  constructor(
    private readonly sysTenantPolicyService: SysTenantPolicyService,
    private readonly authService: AuthService,
  ) {}

  @Get(':sceneCode')
  async getPolicy(
    @Param('sceneCode') sceneCode: string,
    @Query('tenantId') tenantId?: string,
    @Query('policyType') policyType = 'pageRuntime',
    @Req() request?: RequestWithContext,
  ) {
    return this.sysTenantPolicyService.getPolicy(
      sceneCode,
      this.requireTenantId(tenantId, request?.requestContext),
      policyType,
    );
  }

  @Put(':sceneCode')
  async savePolicy(
    @Param('sceneCode') sceneCode: string,
    @Body() body: any,
    @Req() request?: RequestWithContext,
  ) {
    const actor = await this.resolveActor(request);
    return this.sysTenantPolicyService.savePolicy(
      sceneCode,
      this.requireTenantId(body?.tenantId, request?.requestContext),
      body,
      actor.username,
    );
  }

  @Post(':sceneCode/publish')
  async publishPolicy(
    @Param('sceneCode') sceneCode: string,
    @Body() body: any,
    @Req() request?: RequestWithContext,
  ) {
    const actor = await this.resolveActor(request);
    return this.sysTenantPolicyService.publishPolicy(
      sceneCode,
      this.requireTenantId(body?.tenantId, request?.requestContext),
      `${body?.policyType || 'pageRuntime'}`,
      actor.username,
    );
  }

  @Post(':sceneCode/rollback/:logId')
  async rollbackPolicy(
    @Param('sceneCode') sceneCode: string,
    @Param('logId') logId: string,
    @Body() body: any,
    @Req() request?: RequestWithContext,
  ) {
    const actor = await this.resolveActor(request);
    return this.sysTenantPolicyService.rollbackPolicy(
      sceneCode,
      this.requireTenantId(body?.tenantId, request?.requestContext),
      `${body?.policyType || 'pageRuntime'}`,
      Number(logId),
      actor.username,
    );
  }

  @Get(':sceneCode/logs')
  async listPolicyLogs(
    @Param('sceneCode') sceneCode: string,
    @Query('tenantId') tenantId?: string,
    @Query('policyType') policyType = 'pageRuntime',
    @Req() request?: RequestWithContext,
  ) {
    return this.sysTenantPolicyService.listPolicyLogs(
      sceneCode,
      this.requireTenantId(tenantId, request?.requestContext),
      policyType,
    );
  }

  private async resolveActor(request?: RequestWithContext) {
    if (!request) {
      return { username: 'admin' };
    }

    try {
      const accessToken = this.authService.getBearerToken(request);
      const userInfo = await this.authService.getUserInfoFromAccessToken(
        accessToken,
      );
      return { username: userInfo.username || 'admin' };
    } catch {
      return { username: 'admin' };
    }
  }

  private requireTenantId(tenantId: any, requestContext?: AppRequestContext) {
    const normalized = `${tenantId || requestContext?.tenantId || ''}`.trim();
    if (!normalized) {
      throw new BadRequestException('tenantId 不能为空');
    }

    const parsedTenantId = Number.parseInt(normalized, 10);
    if (!Number.isInteger(parsedTenantId) || parsedTenantId <= 0) {
      throw new BadRequestException('tenantId 非法');
    }

    return parsedTenantId;
  }
}
