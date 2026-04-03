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
export class ContractorService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any, username: string) {
    const result = await this.prisma.contractor.create({
      data: {
        businessScope: data.businessScope || '',
        contactPerson: data.contactPerson || '',
        contactPhone: data.contactPhone || '',
        contractorName: data.contractorName || '',
        contractorType: data.contractorType || '',
        creditCode: data.creditCode || '',
        qualification: data.qualification || '',
        remark: data.remark || '',
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
      contractorName?: string;
      contractorType?: string;
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
      ...(params.contractorName ? { contractorName: { contains: params.contractorName } } : {}),
      ...(params.contractorType ? { contractorType: { contains: params.contractorType } } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.contractor.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.contractor.count({ where }),
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
    const result = await this.prisma.contractor.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }
  async update(id: bigint, data: any, username: string) {
    const result = await this.prisma.contractor.update({
      where: { id },
      data: {
        businessScope: data.businessScope || '',
        contactPerson: data.contactPerson || '',
        contactPhone: data.contactPhone || '',
        contractorName: data.contractorName || '',
        contractorType: data.contractorType || '',
        creditCode: data.creditCode || '',
        qualification: data.qualification || '',
        remark: data.remark || '',
        status: data.status || '0',
        updateBy: username,
      },
    });
    return this.serialize(result);
  }
  async remove(id: bigint) {
    const result = await this.prisma.contractor.delete({ where: { id } });
    return this.serialize(result);
  }
  private serialize(item: any) {
    return { ...item, id: item.id.toString() };
  }
}
