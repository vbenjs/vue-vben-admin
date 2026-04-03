import type { Request, Response } from 'express';

import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { createSessionToken, verifySessionToken } from './token.util';

const ACCESS_TOKEN_EXPIRES_IN = 60 * 60 * 2;
const REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 7;
const REFRESH_TOKEN_COOKIE = 'refreshToken';
const SYSTEM_HOME_PATH = '/sys/permission/user';

type LoginParams = {
  fiscalYear?: string;
  password: string;
  tenantId?: number | string;
  username: string;
};

type LoginContextOption = {
  label: string;
  value: number | string;
};

type LoginContextResult = {
  defaultFiscalYear: string;
  defaultTenantId?: number;
  fiscalYears: LoginContextOption[];
  tenants: LoginContextOption[];
};

type ResolvedLoginContext = {
  fiscalYear: string;
  tenantId: string;
  tenantName: string;
};

@Injectable()
export class AuthService {
  private readonly tokenSecret = process.env.AUTH_TOKEN_SECRET || 'riss-system-platform-secret';

  constructor(private readonly prisma: PrismaService) {}

  async getLoginContext(): Promise<LoginContextResult> {
    const currentYear = new Date().getFullYear();
    const configItems = await this.prisma.sysParamConfig.findMany({
      where: {
        configKey: {
          in: ['sys.tenant.defaultFiscalYear', 'sys.tenantRuntime.defaultTenantId'],
        },
      },
      select: { configKey: true, configValue: true },
    });
    const configMap = configItems.reduce<Record<string, string>>((acc, item) => {
      if (item.configValue !== null) {
        acc[item.configKey] = item.configValue;
      }
      return acc;
    }, {});
    const fiscalYears = Array.from({ length: 5 }, (_, index) => {
      const year = currentYear - 2 + index;
      return {
        label: `${year}年度`,
        value: `${year}`,
      };
    });

    const tenants = await this.prisma.sysTenant.findMany({
      where: { status: '0' },
      orderBy: { tenantId: 'asc' },
      select: {
        tenantId: true,
        tenantName: true,
      },
    });

    return {
      defaultFiscalYear: this.normalizeFiscalYear(
        configMap['sys.tenant.defaultFiscalYear'],
        `${currentYear}`,
      ),
      defaultTenantId: this.resolveDefaultTenantId(
        configMap['sys.tenantRuntime.defaultTenantId'],
        tenants.map((item) => item.tenantId),
      ),
      fiscalYears,
      tenants: tenants.map((item) => ({
        label: item.tenantName || `账套${item.tenantId}`,
        value: item.tenantId,
      })),
    };
  }

  async login(params: LoginParams) {
    const { fiscalYear, password, tenantId, username } = params;
    const user = await this.prisma.sysUser.findUnique({ where: { userName: username } });

    if (!user || user.password !== password || user.status === '1') {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const roles = await this.getUserRoles(user.userId, user.userName);
    const loginContext = await this.resolveLoginContext(tenantId, fiscalYear);
    const accessToken = this.createAccessToken(
      user.userId.toString(),
      user.userName,
      roles,
      loginContext,
    );
    const refreshToken = this.createRefreshToken(
      user.userId.toString(),
      user.userName,
      roles,
      loginContext,
    );

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const session = this.verifyToken(refreshToken, 'refresh');
    const user = await this.prisma.sysUser.findUnique({
      where: { userId: BigInt(session.userId) },
    });

    if (!user || user.status === '1') {
      throw new UnauthorizedException('登录状态已失效');
    }

    const roles = await this.getUserRoles(user.userId, user.userName);
    return this.createAccessToken(user.userId.toString(), user.userName, roles, {
      fiscalYear: session.fiscalYear || '',
      tenantId: session.tenantId || '',
      tenantName: session.tenantName || '',
    });
  }

  async getAccessCodesFromAccessToken(accessToken: string) {
    this.verifyToken(accessToken, 'access');

    const menus = await this.prisma.sysMenu.findMany({
      where: { status: '0' },
      select: { perms: true },
    });

    return menus.map((item) => item.perms?.trim()).filter((item): item is string => !!item);
  }

  async getUserInfoFromAccessToken(accessToken: string) {
    const session = this.verifyToken(accessToken, 'access');
    const user = await this.prisma.sysUser.findUnique({
      where: { userId: BigInt(session.userId) },
    });
    const runtimeConfig = await this.prisma.sysParamConfig.findUnique({
      where: { configKey: 'sys.tenantRuntime.defaultTenantId' },
      select: { configValue: true },
    });

    if (!user || user.status === '1') {
      throw new UnauthorizedException('用户不存在或已停用');
    }

    const roles = await this.getUserRoles(user.userId, user.userName);

    return {
      avatar: user.avatar || '',
      desc: this.buildUserDesc(user.remark, session.tenantName, session.fiscalYear),
      fiscalYear: session.fiscalYear || '',
      homePath: SYSTEM_HOME_PATH,
      isDefaultTenant:
        !!session.tenantId && `${session.tenantId}` === `${runtimeConfig?.configValue || ''}`,
      realName: user.nickName || user.userName,
      roles,
      tenantId: session.tenantId || '',
      tenantName: session.tenantName || '',
      token: accessToken,
      userId: user.userId.toString(),
      username: user.userName,
    };
  }

  getBearerToken(request: Request) {
    const authorization = request.headers.authorization || '';
    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('未获取到访问令牌');
    }
    return token;
  }

  getRefreshTokenFromRequest(request: Request) {
    const cookieHeader = request.headers.cookie || '';
    const cookie = cookieHeader
      .split(';')
      .map((item) => item.trim())
      .find((item) => item.startsWith(`${REFRESH_TOKEN_COOKIE}=`));

    if (!cookie) {
      throw new UnauthorizedException('未获取到刷新令牌');
    }

    return decodeURIComponent(cookie.split('=').slice(1).join('='));
  }

  setRefreshTokenCookie(response: Response, token: string) {
    response.setHeader('Set-Cookie', this.buildRefreshCookie(token, REFRESH_TOKEN_EXPIRES_IN));
  }

  clearRefreshTokenCookie(response: Response) {
    response.setHeader('Set-Cookie', this.buildRefreshCookie('', 0));
  }

  private buildRefreshCookie(token: string, maxAge: number) {
    return `${REFRESH_TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
  }

  private buildUserDesc(remark?: null | string, tenantName?: string, fiscalYear?: string) {
    const contextParts = [tenantName, fiscalYear ? `${fiscalYear}年度` : ''].filter(Boolean);
    const baseDesc = remark || '系统管理平台用户';

    if (contextParts.length === 0) {
      return baseDesc;
    }

    return `${baseDesc}（${contextParts.join(' / ')}）`;
  }

  private createAccessToken(
    userId: string,
    username: string,
    roles: string[],
    loginContext: ResolvedLoginContext,
  ) {
    return createSessionToken(
      { ...loginContext, roles, type: 'access', userId, username },
      this.tokenSecret,
      ACCESS_TOKEN_EXPIRES_IN,
    );
  }

  private createRefreshToken(
    userId: string,
    username: string,
    roles: string[],
    loginContext: ResolvedLoginContext,
  ) {
    return createSessionToken(
      { ...loginContext, roles, type: 'refresh', userId, username },
      this.tokenSecret,
      REFRESH_TOKEN_EXPIRES_IN,
    );
  }

  private normalizeFiscalYear(
    fiscalYear?: string,
    defaultFiscalYear = `${new Date().getFullYear()}`,
  ) {
    const value = `${fiscalYear || ''}`.trim();

    if (!value) {
      return defaultFiscalYear;
    }

    if (!/^\d{4}$/.test(value)) {
      throw new BadRequestException('年度格式不正确');
    }

    return value;
  }

  private normalizeTenantId(tenantId?: number | string) {
    if (tenantId === undefined || tenantId === null || `${tenantId}`.trim() === '') {
      return undefined;
    }

    const parsedTenantId = Number.parseInt(`${tenantId}`, 10);
    if (!Number.isInteger(parsedTenantId) || parsedTenantId <= 0) {
      throw new BadRequestException('账套参数不正确');
    }

    return parsedTenantId;
  }

  private async resolveLoginContext(
    tenantId?: number | string,
    fiscalYear?: string,
  ): Promise<ResolvedLoginContext> {
    const loginContext = await this.getLoginContext();
    const normalizedFiscalYear = this.normalizeFiscalYear(
      fiscalYear,
      loginContext.defaultFiscalYear,
    );
    const normalizedTenantId = this.normalizeTenantId(tenantId ?? loginContext.defaultTenantId);

    if (loginContext.tenants.length === 0) {
      return {
        fiscalYear: normalizedFiscalYear,
        tenantId: '',
        tenantName: '',
      };
    }

    const selectedTenant = normalizedTenantId
      ? await this.prisma.sysTenant.findFirst({
          where: {
            status: '0',
            tenantId: normalizedTenantId,
          },
          select: {
            tenantId: true,
            tenantName: true,
          },
        })
      : await this.prisma.sysTenant.findFirst({
          where: { status: '0' },
          orderBy: { tenantId: 'asc' },
          select: {
            tenantId: true,
            tenantName: true,
          },
        });

    if (!selectedTenant) {
      throw new BadRequestException('所选账套不存在或已停用');
    }

    return {
      fiscalYear: normalizedFiscalYear,
      tenantId: `${selectedTenant.tenantId}`,
      tenantName: selectedTenant.tenantName || `账套${selectedTenant.tenantId}`,
    };
  }

  private verifyToken(token: string, type: 'access' | 'refresh') {
    const session = verifySessionToken(token, this.tokenSecret);
    if (!session || session.type !== type) {
      throw new UnauthorizedException('令牌无效或已过期');
    }
    return session;
  }

  private resolveDefaultTenantId(value: string | undefined, tenantIds: number[]) {
    const normalized = this.normalizeTenantId(value);
    if (normalized && tenantIds.includes(normalized)) {
      return normalized;
    }
    return tenantIds[0];
  }

  private async getUserRoles(userId: bigint, username: string) {
    const relations = await this.prisma.sysUserRole.findMany({
      where: { userId },
      select: { roleId: true },
    });

    if (relations.length > 0) {
      const roleIds = relations.map((item) => item.roleId);
      const roles = await this.prisma.sysRole.findMany({
        where: { roleId: { in: roleIds } },
        select: { roleKey: true },
      });
      return roles.map((item) => item.roleKey);
    }

    if (username === 'admin') {
      return ['admin'];
    }

    return ['user'];
  }
}
