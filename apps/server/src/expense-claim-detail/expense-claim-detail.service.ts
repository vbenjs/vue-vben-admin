import type { AppRequestContext } from '../common/request-context/request-context.types';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
function getYearRange(fiscalYear?: string) {
  if (!fiscalYear || !/^\d{4}$/.test(fiscalYear)) return null;
  const start = new Date(`${fiscalYear}-01-01T00:00:00.000Z`);
  const end = new Date(`${Number(fiscalYear) + 1}-01-01T00:00:00.000Z`);
  return { gte: start, lt: end };
}
@Injectable()
export class ExpenseClaimDetailService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any, username: string) {
    const payload = this.normalizePayload(data);
    const result = await this.prisma.expenseClaimDetail.create({
      data: { ...payload, createBy: username },
    });
    return this.serialize(result);
  }
  async findAll(
    params: {
      fiscalYear?: string;
      page?: number;
      pageSize?: number;
      usage?: string;
      indicatorName?: string;
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
      ...(params.usage ? { usage: { contains: params.usage } } : {}),
      ...(params.indicatorName ? { indicatorName: { contains: params.indicatorName } } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.expenseClaimDetail.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.expenseClaimDetail.count({ where }),
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
    const result = await this.prisma.expenseClaimDetail.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }
  async update(id: bigint, data: any, username: string) {
    const payload = this.normalizePayload(data);
    const result = await this.prisma.expenseClaimDetail.update({
      where: { id },
      data: { ...payload, updateBy: username },
    });
    return this.serialize(result);
  }
  async remove(id: bigint) {
    const result = await this.prisma.expenseClaimDetail.delete({ where: { id } });
    return this.serialize(result);
  }
  private normalizePayload(data: any) {
    return {
      applyAmount: data.applyAmount ?? 0,
      claimId: data.claimId ? BigInt(data.claimId) : undefined,
      econCategory: data.econCategory || '',
      indicatorId: data.indicatorId ? BigInt(data.indicatorId) : undefined,
      indicatorName: data.indicatorName || '',
      remainAmount: data.remainAmount ?? 0,
      remark: data.remark || '',
      status: data.status || '0',
      subtotal: data.subtotal ?? data.applyAmount ?? 0,
      usage: data.usage || '',
    } as any;
  }
  private serialize(item: any) {
    return {
      ...item,
      id: item.id.toString(),
      claimId: item.claimId?.toString(),
      indicatorId: item.indicatorId?.toString(),
      realIndicatorId: item.realIndicatorId?.toString(),
    };
  }
}
