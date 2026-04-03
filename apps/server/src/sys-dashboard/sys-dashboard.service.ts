import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatistics(requestContext: AppRequestContext = {}) {
    const configItems = await this.prisma.sysParamConfig.findMany({
      where: {
        configKey: {
          in: [
            'sys.org.name',
            'sys.org.orgNature',
            'sys.org.defaultFundSource',
            'sys.org.defaultPaymentMethod',
            'sys.org.defaultAuxDimension',
            'sys.tenantRuntime.defaultTenantId',
          ],
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

    const [userCount, roleCount, menuCount, loginLogCount] = await Promise.all([
      this.prisma.sysUser.count(),
      this.prisma.sysRole.count(),
      this.prisma.sysMenu.count(),
      this.prisma.sysLogininfor.count(),
    ]);

    const pendingCount = await this.prisma.sysApprovalProcess.count({
      where: { status: '0' },
    });

    const todoList = await this.prisma.sysApprovalProcess.findMany({
      where: { status: '0' },
      orderBy: { createTime: 'desc' },
      take: 5,
    });

    const todoItems = todoList.map((item) => ({
      completed: false,
      content: `需要审批来自于 ${item.createBy || '系统用户'} 的申请记录`,
      date: item.createTime ? item.createTime.toISOString() : new Date().toISOString(),
      title: item.processName || '待审批任务',
    }));

    if (todoItems.length < 5) {
      todoItems.push({
        completed: true,
        content: '审查最近提交到Git仓库的前端代码，确保代码质量和规范。',
        date: new Date().toISOString(),
        title: '审查代码',
      });
    }

    const trendStats: any[] = await this.prisma.$queryRawUnsafe(`
        SELECT DATE(login_time) AS date, COUNT(*) AS count
        FROM sys_logininfor
        WHERE login_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(login_time)
        ORDER BY DATE(login_time) ASC
    `);

    const dateLabels: string[] = [];
    const loginData: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dateLabels.push(dateStr);
      const stat = trendStats.find((s) => s.date && s.date.toISOString().startsWith(dateStr));
      loginData.push(stat ? Number(stat.count) : 0);
    }

    const recentLogs = await this.prisma.sysOperLog.findMany({
      orderBy: { operTime: 'desc' },
      take: 8,
    });

    const trendItems = recentLogs.map((log, index) => ({
      avatar: `svg:avatar-${(index % 4) + 1}`,
      content: `执行了 ${log.title} -> ${log.businessType} 操作`,
      date: log.operTime ? log.operTime.toISOString() : new Date().toISOString(),
      title: log.operName || '系统用户',
    }));

    return {
      chart: {
        dates: dateLabels,
        loginCounts: loginData,
      },
      currentContext: {
        fiscalYear: requestContext.fiscalYear || '',
        fiscalYearLabel: requestContext.fiscalYear ? `${requestContext.fiscalYear}年度` : '',
        isDefaultTenant:
          !!requestContext.tenantId &&
          `${requestContext.tenantId}` === (configMap['sys.tenantRuntime.defaultTenantId'] || ''),
        tenantId: requestContext.tenantId,
        tenantName: requestContext.tenantName || '',
      },
      organizationSummary: {
        defaultAuxDimension: configMap['sys.org.defaultAuxDimension'] || '',
        defaultFundSource: configMap['sys.org.defaultFundSource'] || '',
        defaultPaymentMethod: configMap['sys.org.defaultPaymentMethod'] || '',
        name: configMap['sys.org.name'] || '',
        orgNature: configMap['sys.org.orgNature'] || '',
      },
      overview: {
        loginLogCount,
        menuCount,
        pendingCount,
        roleCount,
        userCount,
      },
      todoItems,
      trendItems,
    };
  }
}
