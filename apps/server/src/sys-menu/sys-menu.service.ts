import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysMenuService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    const parentId = data.parentId === undefined ? 0 : Number(data.parentId);
    const orderNum = data.orderNum === undefined ? 0 : Number(data.orderNum);
    const isFrame = data.isFrame === undefined ? 1 : Number(data.isFrame);
    const isCache = data.isCache === undefined ? 0 : Number(data.isCache);

    return this.prisma.sysMenu.create({
      data: {
        ...data,
        parentId,
        orderNum,
        isFrame,
        isCache,
        createBy: username,
      },
    });
  }

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

  async remove(id: number) {
    return this.prisma.sysMenu.delete({ where: { menuId: id } });
  }

  async update(id: number, data: any, username: string) {
    const parentId = data.parentId === undefined ? 0 : Number(data.parentId);
    const orderNum = data.orderNum === undefined ? 0 : Number(data.orderNum);
    const isFrame = data.isFrame === undefined ? 1 : Number(data.isFrame);
    const isCache = data.isCache === undefined ? 0 : Number(data.isCache);

    // Remove extra unmapped fields injected by frontend AntD Table
    const { menuId, key, children, parent, title, value, ...updateData } = data;

    return this.prisma.sysMenu.update({
      where: { menuId: id },
      data: {
        ...updateData,
        parentId,
        orderNum,
        isFrame,
        isCache,
        updateBy: username,
      },
    });
  }
}
