import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IndicatorAdjustService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    return this.serialize(
      await this.prisma.indicatorAdjust.create({
        data: { ...this.normalizePayload(data), createBy: username },
      }),
    );
  }

  async findAll(params: {
    adjustType?: string;
    deptName?: string;
    indicatorName?: string;
    page?: number;
    pageSize?: number;
    status?: string;
  }) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 10;
    const skip = (page - 1) * pageSize;
    const where = {
      ...(params.indicatorName ? { indicatorName: { contains: params.indicatorName } } : {}),
      ...(params.deptName ? { deptName: { contains: params.deptName } } : {}),
      ...(params.adjustType ? { adjustType: params.adjustType } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.indicatorAdjust.findMany({ where, skip, take: pageSize, orderBy: { createTime: 'desc' } }),
      this.prisma.indicatorAdjust.count({ where }),
    ]);
    return { items: items.map((i) => this.serialize(i)), total };
  }

  async findOne(id: bigint) {
    const r = await this.prisma.indicatorAdjust.findUnique({ where: { id } });
    return r ? this.serialize(r) : null;
  }

  async update(id: bigint, data: any, username: string) {
    return this.serialize(
      await this.prisma.indicatorAdjust.update({
        where: { id },
        data: { ...this.normalizePayload(data), updateBy: username },
      }),
    );
  }

  async remove(id: bigint) {
    return this.serialize(await this.prisma.indicatorAdjust.delete({ where: { id } }));
  }

  private normalizePayload(data: any) {
    return {
      adjustAmount: data.adjustAmount ?? 0,
      adjustDate: data.adjustDate ? new Date(data.adjustDate) : undefined,
      adjustNo: data.adjustNo || '',
      adjustType: data.adjustType || '1',
      deptId: data.deptId ? BigInt(data.deptId) : undefined,
      deptName: data.deptName || '',
      indicatorCode: data.indicatorCode || '',
      indicatorId: data.indicatorId ? BigInt(data.indicatorId) : undefined,
      indicatorName: data.indicatorName || '',
      isVoid: data.isVoid || '0',
      operatorName: data.operatorName || '',
      remark: data.remark || '',
      status: data.status || '0',
    } as any;
  }

  private serialize(item: any) {
    return {
      ...item,
      deptId: item.deptId?.toString(),
      id: item.id.toString(),
      indicatorId: item.indicatorId?.toString(),
    };
  }
}
