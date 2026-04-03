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
export class ResearchFundArrivalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const result = await this.prisma.researchFundArrival.create({
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
      payeeName?: string;
      isReleased?: string;
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
      ...(dateWhere ? { arrivalDate: dateWhere } : {}),
      ...(params.payeeName ? { payeeName: { contains: params.payeeName } } : {}),
      ...(params.isReleased ? { isReleased: params.isReleased } : {}),
      ...(params.status ? { status: params.status } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.researchFundArrival.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.researchFundArrival.count({ where }),
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
    const result = await this.prisma.researchFundArrival.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }

  async remove(id: bigint) {
    const result = await this.prisma.researchFundArrival.delete({ where: { id } });
    return this.serialize(result);
  }

  async update(id: bigint, data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const result = await this.prisma.researchFundArrival.update({
      where: { id },
      data: {
        ...payload,
        updateBy: username,
      },
    });
    return this.serialize(result);
  }

  private normalizePayload(data: any, requestContext: AppRequestContext) {
    return {
      arrivalAmount: data.arrivalAmount ?? 0,
      arrivalDate: this.parseDate(data.arrivalDate, requestContext.fiscalYear),
      claimedAmount: data.claimedAmount ?? 0,
      deptName: data.deptName || '',
      isReleased: data.isReleased || '0',
      payeeAccount: data.payeeAccount || '',
      payeeBank: data.payeeBank || '',
      payeeName: data.payeeName || '',
      remark: data.remark || '',
      releaseDate: this.parseDate(data.releaseDate),
      status: data.status || '0',
    } as any;
  }

  private parseDate(value?: string, fallbackFiscalYear?: string) {
    if (value) {
      return new Date(value);
    }
    if (fallbackFiscalYear && /^\d{4}$/.test(fallbackFiscalYear)) {
      return new Date(`${fallbackFiscalYear}-01-01T00:00:00.000Z`);
    }
    return undefined;
  }

  private serialize(item: any) {
    return {
      ...item,
      deptId: item.deptId?.toString(),
      id: item.id.toString(),
    };
  }
}
