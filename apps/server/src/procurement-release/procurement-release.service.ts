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
export class ProcurementReleaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const result = await this.prisma.procurementRelease.create({
      data: { ...payload, createBy: username },
    });
    return this.serialize(result);
  }

  async findAll(
    params: {
      applyNo?: string;
      fiscalYear?: string;
      page?: number;
      pageSize?: number;
      projectName?: string;
      releaseStatus?: string;
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
      ...(dateWhere ? { releaseDate: dateWhere } : {}),
      ...(params.applyNo ? { applyNo: { contains: params.applyNo } } : {}),
      ...(params.projectName ? { projectName: { contains: params.projectName } } : {}),
      ...(params.releaseStatus ? { releaseStatus: params.releaseStatus } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.procurementRelease.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.procurementRelease.count({ where }),
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
    const result = await this.prisma.procurementRelease.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }

  async update(id: bigint, data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const result = await this.prisma.procurementRelease.update({
      where: { id },
      data: { ...payload, updateBy: username },
    });
    return this.serialize(result);
  }

  async remove(id: bigint) {
    const result = await this.prisma.procurementRelease.delete({ where: { id } });
    return this.serialize(result);
  }

  private normalizePayload(data: any, requestContext: AppRequestContext) {
    return {
      applyId: this.parseBigInt(data.applyId),
      applyNo: data.applyNo || '',
      contractAmount: data.contractAmount ?? 0,
      expenseUsedAmount: data.expenseUsedAmount ?? 0,
      procureApplyAmount: data.procureApplyAmount ?? 0,
      projectName: data.projectName || '',
      releaseAmount: data.releaseAmount ?? 0,
      releaseDate: this.parseDate(data.releaseDate, requestContext.fiscalYear),
      releasedAmount: data.releasedAmount ?? 0,
      releaseStatus: data.releaseStatus || '0',
      remark: data.remark || '',
      status: data.status || '0',
      unitName: data.unitName || '',
      winBidAmount: data.winBidAmount ?? 0,
    } as any;
  }

  private parseBigInt(value?: number | string) {
    if (value === undefined || value === null || value === '') return undefined;
    return BigInt(value);
  }

  private parseDate(value?: string, fallbackFiscalYear?: string) {
    if (value) return new Date(value);
    if (fallbackFiscalYear && /^\d{4}$/.test(fallbackFiscalYear))
      return new Date(`${fallbackFiscalYear}-01-01T00:00:00.000Z`);
    return undefined;
  }

  private serialize(item: any) {
    return { ...item, applyId: item.applyId?.toString(), id: item.id.toString() };
  }
}
