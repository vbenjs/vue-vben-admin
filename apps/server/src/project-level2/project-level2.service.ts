import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectLevel2Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    return this.serialize(
      await this.prisma.projectLevel2.create({
        data: { ...this.normalizePayload(data), createBy: username },
      }),
    );
  }

  async findAll(params: {
    deptName?: string;
    level1Id?: string;
    page?: number;
    pageSize?: number;
    projectName?: string;
    status?: string;
  }) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 10;
    const skip = (page - 1) * pageSize;
    const where = {
      ...(params.projectName ? { projectName: { contains: params.projectName } } : {}),
      ...(params.deptName ? { deptName: { contains: params.deptName } } : {}),
      ...(params.level1Id ? { level1Id: BigInt(params.level1Id) } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.projectLevel2.findMany({ where, skip, take: pageSize, orderBy: { createTime: 'desc' } }),
      this.prisma.projectLevel2.count({ where }),
    ]);
    return { items: items.map((i) => this.serialize(i)), total };
  }

  async findOne(id: bigint) {
    const r = await this.prisma.projectLevel2.findUnique({ where: { id } });
    return r ? this.serialize(r) : null;
  }

  async update(id: bigint, data: any, username: string) {
    return this.serialize(
      await this.prisma.projectLevel2.update({
        where: { id },
        data: { ...this.normalizePayload(data), updateBy: username },
      }),
    );
  }

  async remove(id: bigint) {
    return this.serialize(await this.prisma.projectLevel2.delete({ where: { id } }));
  }

  private normalizePayload(data: any) {
    return {
      deptId: data.deptId ? BigInt(data.deptId) : undefined,
      deptName: data.deptName || '',
      expendCategory: data.expendCategory || '',
      funcCategory: data.funcCategory || '',
      fundSource: data.fundSource || '',
      isGovProcure: data.isGovProcure || '0',
      level1Id: data.level1Id ? BigInt(data.level1Id) : undefined,
      projectCode: data.projectCode || '',
      projectName: data.projectName || '',
      remark: data.remark || '',
      status: data.status || '0',
    } as any;
  }

  private serialize(item: any) {
    return { ...item, id: item.id.toString(), deptId: item.deptId?.toString(), level1Id: item.level1Id?.toString() };
  }
}
