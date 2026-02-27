import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysMenuService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { menuName?: string; status?: string }) {
    const { menuName, status } = params;
    const where = {
      ...(menuName ? { menuName: { contains: menuName } } : {}),
      ...(status ? { status } : {}),
    };

    return this.prisma.sysMenu.findMany({
      where,
      orderBy: { orderNum: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.sysMenu.findUnique({ where: { menuId: id } });
  }

  async create(data: any, username: string) {
    return this.prisma.sysMenu.create({
      data: {
        ...data,
        createBy: username,
      },
    });
  }

  async update(id: number, data: any, username: string) {
    return this.prisma.sysMenu.update({
      where: { menuId: id },
      data: {
        ...data,
        updateBy: username,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.sysMenu.delete({ where: { menuId: id } });
  }
}
