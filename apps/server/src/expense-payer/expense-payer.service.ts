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
export class ExpensePayerService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any, username: string) {
    const result = await this.prisma.expensePayer.create({
      data: {
        bankAccount: data.bankAccount || '',
        bankName: data.bankName || '',
        isEnabled: data.isEnabled || '1',
        payerName: data.payerName || '',
        pinyinCode: data.pinyinCode || '',
        relatedUnit: data.relatedUnit || '',
        remark: data.remark || '',
        sortCode: data.sortCode || '',
        status: data.status || '0',
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
      payerName?: string;
      bankName?: string;
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
      ...(params.payerName ? { payerName: { contains: params.payerName } } : {}),
      ...(params.bankName ? { bankName: { contains: params.bankName } } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.expensePayer.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.expensePayer.count({ where }),
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
    const result = await this.prisma.expensePayer.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }
  async update(id: bigint, data: any, username: string) {
    const result = await this.prisma.expensePayer.update({
      where: { id },
      data: {
        bankAccount: data.bankAccount || '',
        bankName: data.bankName || '',
        isEnabled: data.isEnabled || '1',
        payerName: data.payerName || '',
        pinyinCode: data.pinyinCode || '',
        relatedUnit: data.relatedUnit || '',
        remark: data.remark || '',
        sortCode: data.sortCode || '',
        status: data.status || '0',
        updateBy: username,
      },
    });
    return this.serialize(result);
  }
  async remove(id: bigint) {
    const result = await this.prisma.expensePayer.delete({ where: { id } });
    return this.serialize(result);
  }
  private serialize(item: any) {
    return { ...item, id: item.id.toString(), deptId: item.deptId?.toString() };
  }
}
