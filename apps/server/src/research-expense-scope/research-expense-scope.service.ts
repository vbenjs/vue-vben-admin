import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Injectable } from '@nestjs/common';

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
export class ResearchExpenseScopeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string, _requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data);
    const result = await this.prisma.researchExpenseScope.create({
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
      indicatorId?: string;
      scopeName?: string;
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
      ...(params.indicatorId ? { indicatorId: BigInt(params.indicatorId) } : {}),
      ...(params.scopeName ? { scopeName: { contains: params.scopeName } } : {}),
      ...(params.status ? { status: params.status } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.researchExpenseScope.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.researchExpenseScope.count({ where }),
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
    const result = await this.prisma.researchExpenseScope.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }

  async update(id: bigint, data: any, username: string, _requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data);
    const result = await this.prisma.researchExpenseScope.update({
      where: { id },
      data: {
        ...payload,
        updateBy: username,
      },
    });
    return this.serialize(result);
  }

  async remove(id: bigint) {
    const result = await this.prisma.researchExpenseScope.delete({ where: { id } });
    return this.serialize(result);
  }

  private normalizePayload(data: any) {
    const scopeAmount = data.scopeAmount ?? 0;
    const usedAmount = data.usedAmount ?? 0;
    const availableAmount =
      data.availableAmount !== undefined && data.availableAmount !== ''
        ? data.availableAmount
        : Number(scopeAmount || 0) - Number(usedAmount || 0);

    return {
      availableAmount,
      indicatorId: data.indicatorId ? BigInt(data.indicatorId) : undefined,
      remark: data.remark || '',
      scopeAmount,
      scopeName: data.scopeName || '',
      status: data.status || '0',
      usedAmount,
    } as any;
  }

  private serialize(item: any) {
    return {
      ...item,
      id: item.id.toString(),
      indicatorId: item.indicatorId?.toString(),
    };
  }
}
