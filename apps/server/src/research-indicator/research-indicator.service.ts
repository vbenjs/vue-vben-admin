import type { AppRequestContext } from '../common/request-context/request-context.types';

import { BadRequestException, Injectable } from '@nestjs/common';

import { FinanceWorkflowService } from '../finance-workflow/finance-workflow.service';
import { PrismaService } from '../prisma/prisma.service';

function getYearRange(fiscalYear?: string) {
  if (!fiscalYear || !/^\d{4}$/.test(fiscalYear)) {
    return null;
  }
  const start = new Date(`${fiscalYear}-01-01T00:00:00.000Z`);
  const end = new Date(`${Number(fiscalYear) + 1}-01-01T00:00:00.000Z`);
  return { gte: start, lt: end };
}

@Injectable()
export class ResearchIndicatorService {
  constructor(
    private readonly financeWorkflowService: FinanceWorkflowService,
    private readonly prisma: PrismaService,
  ) {}

  async create(data: any, username: string, _requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data);
    const result = await this.prisma.researchIndicator.create({
      data: {
        ...payload,
        createBy: username,
      },
    });
    return this.serialize(result);
  }

  async findAll(
    params: {
      fiscalYear?: string;
      page?: number;
      pageSize?: number;
      projectName?: string;
      indicatorName?: string;
      flowStatus?: string;
      status?: string;
    },
    requestContext: AppRequestContext = {},
  ) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 10;
    const skip = (page - 1) * pageSize;
    const fiscalYear = (params.fiscalYear || requestContext.fiscalYear || '').trim();
    const dateWhere = getYearRange(fiscalYear);

    const where = {
      ...(dateWhere ? { createTime: dateWhere } : {}),
      ...(params.projectName ? { projectName: { contains: params.projectName } } : {}),
      ...(params.indicatorName ? { indicatorName: { contains: params.indicatorName } } : {}),
      ...(params.flowStatus ? { flowStatus: params.flowStatus } : {}),
      ...(params.status ? { status: params.status } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.researchIndicator.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.researchIndicator.count({ where }),
    ]);

    return {
      context: {
        fiscalYear,
        tenantId: requestContext.tenantId,
        tenantName: requestContext.tenantName || '',
      },
      items: items.map((item) => this.serialize(item)),
      total,
    };
  }

  async findOne(id: bigint) {
    const result = await this.prisma.researchIndicator.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }

  async getHistory(id: bigint) {
    const record = await this.requireResearchIndicator(id);
    return this.financeWorkflowService.getHistory({
      businessNo: this.getBusinessNo(record),
    });
  }

  async submit(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireResearchIndicator(id);
    if (record.flowStatus === '1') {
      throw new BadRequestException('当前科研指标已送审，无需重复提交');
    }

    return this.financeWorkflowService.executeCommand(
      'submit',
      {
        businessId: record.id.toString(),
        businessNo: this.getBusinessNo(record),
        businessType: 'research-indicator',
        currentNode: '申请节点',
        title: record.indicatorName || this.getBusinessNo(record),
      },
      actor,
    );
  }

  async withdraw(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireResearchIndicator(id);
    if (record.flowStatus !== '1') {
      throw new BadRequestException('当前科研指标未送审，无法撤回');
    }

    return this.financeWorkflowService.executeCommand(
      'withdraw',
      {
        businessId: record.id.toString(),
        businessNo: this.getBusinessNo(record),
        businessType: 'research-indicator',
        currentNode: '申请节点',
        title: record.indicatorName || this.getBusinessNo(record),
      },
      actor,
    );
  }

  async update(id: bigint, data: any, username: string, _requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data);
    const result = await this.prisma.researchIndicator.update({
      where: { id },
      data: {
        ...payload,
        updateBy: username,
      },
    });
    return this.serialize(result);
  }

  async remove(id: bigint) {
    const result = await this.prisma.researchIndicator.delete({ where: { id } });
    return this.serialize(result);
  }

  private normalizePayload(data: any) {
    const indicatorAmount = data.indicatorAmount ?? 0;
    const usedAmount = data.usedAmount ?? 0;
    const availableAmount =
      data.availableAmount !== undefined && data.availableAmount !== ''
        ? data.availableAmount
        : Number(indicatorAmount || 0) - Number(usedAmount || 0);

    return {
      availableAmount,
      deptName: data.deptName || '',
      flowStatus: data.flowStatus || '0',
      indicatorAmount,
      indicatorCode: data.indicatorCode || '',
      indicatorName: data.indicatorName || '',
      projectName: data.projectName || '',
      remark: data.remark || '',
      status: data.status || '0',
      usedAmount,
    } as any;
  }

  private getBusinessNo(record: { id: bigint; indicatorCode?: null | string }) {
    const indicatorCode = `${record.indicatorCode || ''}`.trim();
    return indicatorCode || `research-indicator-${record.id.toString()}`;
  }

  private async requireResearchIndicator(id: bigint) {
    const record = await this.prisma.researchIndicator.findUnique({ where: { id } });
    if (!record) {
      throw new BadRequestException('科研指标不存在');
    }
    return record;
  }

  private serialize(item: any) {
    return {
      ...item,
      deptId: item.deptId?.toString(),
      id: item.id.toString(),
      projectId: item.projectId?.toString(),
    };
  }
}
