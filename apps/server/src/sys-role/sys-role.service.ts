import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysRoleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { skip?: number; take?: number; roleName?: string; status?: string }) {
    const { skip, take, roleName, status } = params;
    const where = {
      ...(roleName ? { roleName: { contains: roleName } } : {}),
      ...(status ? { status } : {}),
    };

    const items = await this.prisma.sysRole.findMany({
      skip,
      take,
      where,
      orderBy: { roleSort: 'asc' },
    });
    const total = await this.prisma.sysRole.count({ where });

    return { items, total };
  }

  async findOne(id: number) {
    return this.prisma.sysRole.findUnique({ where: { roleId: id } });
  }

  async create(data: any, username: string) {
    const roleSort = data.roleSort !== undefined ? Number(data.roleSort) : 0;
    return this.prisma.sysRole.create({
      data: {
        ...data,
        roleSort,
        createBy: username,
      },
    });
  }

  async update(id: number, data: any, username: string) {
    const roleSort = data.roleSort !== undefined ? Number(data.roleSort) : 0;
    const { roleId, ...updateData } = data;
    return this.prisma.sysRole.update({
      where: { roleId: id },
      data: {
        ...updateData,
        roleSort,
        updateBy: username,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.sysRole.delete({ where: { roleId: id } });
  }
}
