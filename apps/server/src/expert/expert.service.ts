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
export class ExpertService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any, username: string) {
    const result = await this.prisma.expert.create({
      data: {
        email: data.email || '',
        expertName: data.expertName || '',
        expertType: data.expertType || '',
        idCard: data.idCard || '',
        phone: data.phone || '',
        remark: data.remark || '',
        specialty: data.specialty || '',
        status: data.status || '0',
        title: data.title || '',
        workUnit: data.workUnit || '',
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
      expertName?: string;
      expertType?: string;
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
      ...(params.expertName ? { expertName: { contains: params.expertName } } : {}),
      ...(params.expertType ? { expertType: { contains: params.expertType } } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.expert.findMany({ where, skip, take: pageSize, orderBy: { createTime: 'desc' } }),
      this.prisma.expert.count({ where }),
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
    const result = await this.prisma.expert.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }
  async update(id: bigint, data: any, username: string) {
    const result = await this.prisma.expert.update({
      where: { id },
      data: {
        email: data.email || '',
        expertName: data.expertName || '',
        expertType: data.expertType || '',
        idCard: data.idCard || '',
        phone: data.phone || '',
        remark: data.remark || '',
        specialty: data.specialty || '',
        status: data.status || '0',
        title: data.title || '',
        workUnit: data.workUnit || '',
        updateBy: username,
      },
    });
    return this.serialize(result);
  }
  async remove(id: bigint) {
    const result = await this.prisma.expert.delete({ where: { id } });
    return this.serialize(result);
  }
  private serialize(item: any) {
    return { ...item, id: item.id.toString() };
  }
}
