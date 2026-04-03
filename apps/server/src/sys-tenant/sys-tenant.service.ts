import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysTenantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    return this.prisma.sysTenant.create({
      data: {
        ...data,
        createBy: username,
      },
    });
  }

  async findAll(params: { skip?: number; status?: string; take?: number; tenantName?: string }) {
    const { skip, take, tenantName, status } = params;

    const where = {
      ...(tenantName ? { tenantName: { contains: tenantName } } : {}),
      ...(status ? { status } : {}),
    };

    const items = await this.prisma.sysTenant.findMany({
      skip,
      take,
      where,
      orderBy: { createTime: 'desc' },
    });
    const total = await this.prisma.sysTenant.count({ where });

    return { items, total };
  }

  async findOne(id: number) {
    return this.prisma.sysTenant.findUnique({ where: { tenantId: id } });
  }

  async remove(id: number) {
    return this.prisma.sysTenant.delete({ where: { tenantId: id } });
  }

  async update(id: number, data: any, username: string) {
    const { tenantId, key, children, parent, title, value, ...updateData } = data;
    return this.prisma.sysTenant.update({
      where: { tenantId: id },
      data: {
        ...updateData,
        updateBy: username,
      },
    });
  }
}
