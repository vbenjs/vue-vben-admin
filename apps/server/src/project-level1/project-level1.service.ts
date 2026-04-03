import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectLevel1Service {
  constructor(private readonly prisma: PrismaService) {}

  /** 新增一级项目 */
  async create(data: any, username: string) {
    return this.serialize(
      await this.prisma.projectLevel1.create({
        data: { ...this.normalizePayload(data), createBy: username },
      }),
    );
  }

  /** 分页查询 */
  async findAll(params: {
    deptName?: string;
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
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.projectLevel1.findMany({ where, skip, take: pageSize, orderBy: { createTime: 'desc' } }),
      this.prisma.projectLevel1.count({ where }),
    ]);
    return { items: items.map((i) => this.serialize(i)), total };
  }

  async findOne(id: bigint) {
    const r = await this.prisma.projectLevel1.findUnique({ where: { id } });
    return r ? this.serialize(r) : null;
  }

  async update(id: bigint, data: any, username: string) {
    return this.serialize(
      await this.prisma.projectLevel1.update({
        where: { id },
        data: { ...this.normalizePayload(data), updateBy: username },
      }),
    );
  }

  async remove(id: bigint) {
    return this.serialize(await this.prisma.projectLevel1.delete({ where: { id } }));
  }

  private normalizePayload(data: any) {
    return {
      deptId: data.deptId ? BigInt(data.deptId) : undefined,
      deptName: data.deptName || '',
      expendCategory: data.expendCategory || '',
      funcCategory: data.funcCategory || '',
      fundSource: data.fundSource || '',
      isGovProcure: data.isGovProcure || '0',
      projectCode: data.projectCode || '',
      projectName: data.projectName || '',
      remark: data.remark || '',
      status: data.status || '0',
    } as any;
  }

  private serialize(item: any) {
    return { ...item, id: item.id.toString(), deptId: item.deptId?.toString() };
  }
}
