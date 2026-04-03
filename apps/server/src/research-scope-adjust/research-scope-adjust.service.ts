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
export class ResearchScopeAdjustService {
  constructor(
    private readonly financeWorkflowService: FinanceWorkflowService,
    private readonly prisma: PrismaService,
  ) {}

  async create(data: any, username: string, _requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data);
    const result = await this.prisma.researchScopeAdjust.create({
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
      indicatorName?: string;
      outScopeName?: string;
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
      ...(params.indicatorName ? { indicatorName: { contains: params.indicatorName } } : {}),
      ...(params.outScopeName ? { outScopeName: { contains: params.outScopeName } } : {}),
      ...(params.flowStatus ? { flowStatus: params.flowStatus } : {}),
      ...(params.status ? { status: params.status } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.researchScopeAdjust.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.researchScopeAdjust.count({ where }),
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
    const result = await this.prisma.researchScopeAdjust.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }

  async getHistory(id: bigint) {
    const record = await this.requireResearchScopeAdjust(id);
    return this.financeWorkflowService.getHistory({ businessNo: this.getBusinessNo(record) });
  }

  async submit(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireResearchScopeAdjust(id);
    if (record.flowStatus === '1') {
      throw new BadRequestException('当前范围调剂已送审，无需重复提交');
    }

    return this.financeWorkflowService.executeCommand(
      'submit',
      {
        businessId: record.id.toString(),
        businessNo: this.getBusinessNo(record),
        businessType: 'research-scope-adjust',
        currentNode: '申请节点',
        title: record.indicatorName || this.getBusinessNo(record),
      },
      actor,
    );
  }

  async withdraw(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireResearchScopeAdjust(id);
    if (record.flowStatus !== '1') {
      throw new BadRequestException('当前范围调剂未送审，无法撤回');
    }

    return this.financeWorkflowService.executeCommand(
      'withdraw',
      {
        businessId: record.id.toString(),
        businessNo: this.getBusinessNo(record),
        businessType: 'research-scope-adjust',
        currentNode: '申请节点',
        title: record.indicatorName || this.getBusinessNo(record),
      },
      actor,
    );
  }

  async update(id: bigint, data: any, username: string, _requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data);
    const result = await this.prisma.researchScopeAdjust.update({
      where: { id },
      data: {
        ...payload,
        updateBy: username,
      },
    });
    return this.serialize(result);
  }

  async remove(id: bigint) {
    const result = await this.prisma.researchScopeAdjust.delete({ where: { id } });
    return this.serialize(result);
  }

  private normalizePayload(data: any) {
    return {
      flowStatus: data.flowStatus || '0',
      inAdjustAmount: data.inAdjustAmount ?? 0,
      inScopeId: data.inScopeId ? BigInt(data.inScopeId) : undefined,
      inScopeName: data.inScopeName || '',
      indicatorId: data.indicatorId ? BigInt(data.indicatorId) : undefined,
      indicatorName: data.indicatorName || '',
      outAdjustAmount: data.outAdjustAmount ?? 0,
      outScopeId: data.outScopeId ? BigInt(data.outScopeId) : undefined,
      outScopeName: data.outScopeName || '',
      remark: data.remark || '',
      status: data.status || '0',
    } as any;
  }

  private getBusinessNo(record: { id: bigint }) {
    return `research-scope-adjust-${record.id.toString()}`;
  }

  private async requireResearchScopeAdjust(id: bigint) {
    const record = await this.prisma.researchScopeAdjust.findUnique({ where: { id } });
    if (!record) {
      throw new BadRequestException('范围调剂不存在');
    }
    return record;
  }

  private serialize(item: any) {
    return {
      ...item,
      id: item.id.toString(),
      inScopeId: item.inScopeId?.toString(),
      indicatorId: item.indicatorId?.toString(),
      outScopeId: item.outScopeId?.toString(),
    };
  }
}
