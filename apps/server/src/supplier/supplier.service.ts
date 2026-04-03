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
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    const payload = this.normalizePayload(data);
    const result = await this.prisma.supplier.create({ data: { ...payload, createBy: username } });
    return this.serialize(result);
  }

  async findAll(
    params: {
      fiscalYear?: string;
      page?: number;
      pageSize?: number;
      procureType?: string;
      status?: string;
      supplierCode?: string;
      supplierName?: string;
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
      ...(params.supplierCode ? { supplierCode: { contains: params.supplierCode } } : {}),
      ...(params.supplierName ? { supplierName: { contains: params.supplierName } } : {}),
      ...(params.procureType ? { procureType: { contains: params.procureType } } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.supplier.count({ where }),
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
    const result = await this.prisma.supplier.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }

  async update(id: bigint, data: any, username: string) {
    const payload = this.normalizePayload(data);
    const result = await this.prisma.supplier.update({
      where: { id },
      data: { ...payload, updateBy: username },
    });
    return this.serialize(result);
  }

  async remove(id: bigint) {
    const result = await this.prisma.supplier.delete({ where: { id } });
    return this.serialize(result);
  }

  private normalizePayload(data: any) {
    return {
      creditCode: data.creditCode || '',
      enterpriseType: data.enterpriseType || '',
      isAbnormal: data.isAbnormal || '0',
      procureType: data.procureType || '',
      registeredCapital: data.registeredCapital ?? 0,
      remark: data.remark || '',
      status: data.status || '0',
      supplierAddress: data.supplierAddress || '',
      supplierCode: data.supplierCode || '',
      supplierName: data.supplierName || '',
    } as any;
  }

  private serialize(item: any) {
    return { ...item, id: item.id.toString() };
  }
}
