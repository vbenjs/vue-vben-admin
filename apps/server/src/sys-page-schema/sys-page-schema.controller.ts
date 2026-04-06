import type { Request } from 'express';

import type { AppRequestContext } from '../common/request-context/request-context.types';

import {
  BadRequestException,
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
import { SysPageSchemaService } from './sys-page-schema.service';

type RequestWithContext = Request & {
  requestContext?: AppRequestContext;
};

@Controller('sys/page-schema')
export class SysPageSchemaController {
  constructor(
    private readonly sysPageSchemaService: SysPageSchemaService,
    private readonly authService: AuthService,
  ) {}

  @Post('template')
  async createTemplate(@Body() body: any, @Req() request?: RequestWithContext) {
    const actor = await this.resolveActor(request);
    return this.sysPageSchemaService.createTemplate(body, actor.username);
  }

  @Get('template/list')
  async findTemplateList(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '20',
    @Query('pageCode') pageCode?: string,
    @Query('pageName') pageName?: string,
    @Query('status') status?: string,
  ) {
    return this.sysPageSchemaService.findTemplateList({
      page: Number(page),
      pageCode,
      pageName,
      pageSize: Number(pageSize),
      status,
    });
  }

  @Get('template/:id')
  async findTemplateOne(@Param('id') id: string) {
    return this.sysPageSchemaService.findTemplateOne(+id);
  }

  @Put('template/:id')
  async updateTemplate(
    @Param('id') id: string,
    @Body() body: any,
    @Req() request?: RequestWithContext,
  ) {
    const actor = await this.resolveActor(request);
    return this.sysPageSchemaService.updateTemplate(+id, body, actor.username);
  }

  @Delete('template/:id')
  async removeTemplate(@Param('id') id: string) {
    return this.sysPageSchemaService.removeTemplate(+id);
  }

  @Post('template/:id/publish')
  async publishTemplate(@Param('id') id: string, @Req() request?: RequestWithContext) {
    const actor = await this.resolveActor(request);
    return this.sysPageSchemaService.publishTemplate(+id, actor.username);
  }

  @Post('template/:id/rollback/:logId')
  async rollbackTemplate(
    @Param('id') id: string,
    @Param('logId') logId: string,
    @Req() request?: RequestWithContext,
  ) {
    const actor = await this.resolveActor(request);
    return this.sysPageSchemaService.rollbackTemplate(+id, +logId, actor.username);
  }

  @Get('template/:id/logs')
  async listTemplateLogs(@Param('id') id: string) {
    return this.sysPageSchemaService.listTemplateLogs(+id);
  }

  @Get('tenant/:pageCode')
  async getTenantOverride(
    @Param('pageCode') pageCode: string,
    @Query('tenantId') tenantId?: string,
    @Req() request?: RequestWithContext,
  ) {
    return this.sysPageSchemaService.getTenantOverride(
      pageCode,
      this.requireTenantId(tenantId, request?.requestContext),
    );
  }

  @Put('tenant/:pageCode')
  async saveTenantOverride(
    @Param('pageCode') pageCode: string,
    @Body() body: any,
    @Req() request?: RequestWithContext,
  ) {
    const actor = await this.resolveActor(request);
    return this.sysPageSchemaService.saveTenantOverride(
      pageCode,
      this.requireTenantId(body?.tenantId, request?.requestContext),
      body,
      actor.username,
    );
  }

  @Post('tenant/:pageCode/publish')
  async publishTenantOverride(
    @Param('pageCode') pageCode: string,
    @Body() body: any,
    @Req() request?: RequestWithContext,
  ) {
    const actor = await this.resolveActor(request);
    return this.sysPageSchemaService.publishTenantOverride(
      pageCode,
      this.requireTenantId(body?.tenantId, request?.requestContext),
      actor.username,
    );
  }

  @Post('tenant/:pageCode/rollback/:logId')
  async rollbackTenantOverride(
    @Param('pageCode') pageCode: string,
    @Param('logId') logId: string,
    @Body() body: any,
    @Req() request?: RequestWithContext,
  ) {
    const actor = await this.resolveActor(request);
    return this.sysPageSchemaService.rollbackTenantOverride(
      pageCode,
      this.requireTenantId(body?.tenantId, request?.requestContext),
      +logId,
      actor.username,
    );
  }

  @Get('tenant/:pageCode/logs')
  async listTenantLogs(
    @Param('pageCode') pageCode: string,
    @Query('tenantId') tenantId?: string,
    @Req() request?: RequestWithContext,
  ) {
    return this.sysPageSchemaService.listTenantLogs(
      pageCode,
      this.requireTenantId(tenantId, request?.requestContext),
    );
  }

  @Get('user/:pageCode')
  async getUserPreference(
    @Param('pageCode') pageCode: string,
    @Query('tenantId') tenantId?: string,
    @Query('userId') userId?: string,
    @Req() request?: RequestWithContext,
  ) {
    return this.sysPageSchemaService.getUserPreference(
      pageCode,
      this.resolveTenantId(tenantId, request?.requestContext, false) ?? 0,
      await this.requireUserId(userId, request),
    );
  }

  @Put('user/:pageCode')
  async saveUserPreference(
    @Param('pageCode') pageCode: string,
    @Body() body: any,
    @Req() request?: RequestWithContext,
  ) {
    const actor = await this.resolveActor(request);
    return this.sysPageSchemaService.saveUserPreference(
      pageCode,
      this.resolveTenantId(body?.tenantId, request?.requestContext, false) ?? 0,
      await this.requireUserId(body?.userId, request),
      body,
      actor.username,
    );
  }

  @Post('user/:pageCode/publish')
  async publishUserPreference(
    @Param('pageCode') pageCode: string,
    @Body() body: any,
    @Req() request?: RequestWithContext,
  ) {
    const actor = await this.resolveActor(request);
    return this.sysPageSchemaService.publishUserPreference(
      pageCode,
      this.resolveTenantId(body?.tenantId, request?.requestContext, false) ?? 0,
      await this.requireUserId(body?.userId, request),
      actor.username,
    );
  }

  @Post('user/:pageCode/rollback/:logId')
  async rollbackUserPreference(
    @Param('pageCode') pageCode: string,
    @Param('logId') logId: string,
    @Body() body: any,
    @Req() request?: RequestWithContext,
  ) {
    const actor = await this.resolveActor(request);
    return this.sysPageSchemaService.rollbackUserPreference(
      pageCode,
      this.resolveTenantId(body?.tenantId, request?.requestContext, false) ?? 0,
      await this.requireUserId(body?.userId, request),
      +logId,
      actor.username,
    );
  }

  @Get('user/:pageCode/logs')
  async listUserLogs(
    @Param('pageCode') pageCode: string,
    @Query('tenantId') tenantId?: string,
    @Query('userId') userId?: string,
    @Req() request?: RequestWithContext,
  ) {
    return this.sysPageSchemaService.listUserLogs(
      pageCode,
      this.resolveTenantId(tenantId, request?.requestContext, false) ?? 0,
      await this.requireUserId(userId, request),
    );
  }

  @Get('runtime/:pageCode')
  async getRuntime(
    @Param('pageCode') pageCode: string,
    @Query('mode') mode: 'draft' | 'published' = 'published',
    @Query('tenantId') tenantId?: string,
    @Query('userId') userId?: string,
    @Req() request?: RequestWithContext,
  ) {
    return this.sysPageSchemaService.getRuntime(pageCode, {
      mode,
      tenantId: this.resolveTenantId(tenantId, request?.requestContext, false, true),
      userId: await this.resolveUserId(userId, request, true),
    });
  }

  private async resolveActor(request?: RequestWithContext) {
    const userId = await this.resolveUserId(undefined, request, true);
    if (!request) {
      return { userId, username: 'admin' };
    }

    try {
      const accessToken = this.authService.getBearerToken(request);
      const userInfo = await this.authService.getUserInfoFromAccessToken(accessToken);
      return {
        userId: userInfo.userId,
        username: userInfo.username || 'admin',
      };
    } catch {
      return {
        userId,
        username: 'admin',
      };
    }
  }

  private resolveTenantId(
    tenantId: any,
    requestContext?: AppRequestContext,
    required = true,
    allowUndefined = false,
  ) {
    const normalized = `${tenantId || requestContext?.tenantId || ''}`.trim();
    if (!normalized) {
      if (allowUndefined) {
        return undefined;
      }
      if (required) {
        throw new BadRequestException('tenantId 不能为空');
      }
      return 0;
    }

    const parsedTenantId = Number.parseInt(normalized, 10);
    if (!Number.isInteger(parsedTenantId) || parsedTenantId < 0) {
      throw new BadRequestException('tenantId 非法');
    }

    return parsedTenantId;
  }

  private requireTenantId(tenantId: any, requestContext?: AppRequestContext) {
    return this.resolveTenantId(tenantId, requestContext, true, false) ?? 0;
  }

  private async resolveUserId(
    userId: string | undefined,
    request?: RequestWithContext,
    allowUndefined = false,
  ) {
    const normalized = `${userId || ''}`.trim();
    if (normalized) {
      return normalized;
    }

    if (!request) {
      if (allowUndefined) {
        return undefined;
      }
      throw new BadRequestException('userId 不能为空');
    }

    try {
      const accessToken = this.authService.getBearerToken(request);
      const userInfo = await this.authService.getUserInfoFromAccessToken(accessToken);
      return userInfo.userId;
    } catch {
      if (allowUndefined) {
        return undefined;
      }
      throw new BadRequestException('userId 不能为空');
    }
  }

  private async requireUserId(userId: string | undefined, request?: RequestWithContext) {
    return (await this.resolveUserId(userId, request, false)) || '';
  }
}
