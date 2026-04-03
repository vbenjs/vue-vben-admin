import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IndicatorAuthService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    return this.serialize(
      await this.prisma.indicatorAuth.create({
        data: { ...this.normalizePayload(data), createBy: username },
      }),
    );
  }

  async findAll(params: {
    authDeptName?: string;
    indicatorId?: string;
    page?: number;
    pageSize?: number;
    status?: string;
  }) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 10;
    const skip = (page - 1) * pageSize;
    const where = {
      ...(params.indicatorId ? { indicatorId: BigInt(params.indicatorId) } : {}),
      ...(params.authDeptName ? { authDeptName: { contains: params.authDeptName } } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.indicatorAuth.findMany({ where, skip, take: pageSize, orderBy: { createTime: 'desc' } }),
      this.prisma.indicatorAuth.count({ where }),
    ]);
    return { items: items.map((i) => this.serialize(i)), total };
  }

  async findOne(id: bigint) {
    const r = await this.prisma.indicatorAuth.findUnique({ where: { id } });
    return r ? this.serialize(r) : null;
  }

  async update(id: bigint, data: any, username: string) {
    return this.serialize(
      await this.prisma.indicatorAuth.update({
        where: { id },
        data: { ...this.normalizePayload(data), updateBy: username },
      }),
    );
  }

  async remove(id: bigint) {
    return this.serialize(await this.prisma.indicatorAuth.delete({ where: { id } }));
  }

  private normalizePayload(data: any) {
    return {
      authAmount: data.authAmount ?? 0,
      authDeptId: data.authDeptId ? BigInt(data.authDeptId) : undefined,
      authDeptName: data.authDeptName || '',
      authType: data.authType || '1',
      authUserId: data.authUserId ? BigInt(data.authUserId) : undefined,
      authUserName: data.authUserName || '',
      controlMode: data.controlMode || '1',
      indicatorId: data.indicatorId ? BigInt(data.indicatorId) : undefined,
      remark: data.remark || '',
      status: data.status || '0',
      usedAmount: data.usedAmount ?? 0,
    } as any;
  }

  private serialize(item: any) {
    return {
      ...item,
      authDeptId: item.authDeptId?.toString(),
      authUserId: item.authUserId?.toString(),
      id: item.id.toString(),
      indicatorId: item.indicatorId?.toString(),
    };
  }
}
