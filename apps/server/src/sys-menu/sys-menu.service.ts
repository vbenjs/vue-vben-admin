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
    const parentId = data.parentId !== undefined ? Number(data.parentId) : 0;
    const orderNum = data.orderNum !== undefined ? Number(data.orderNum) : 0;
    const isFrame = data.isFrame !== undefined ? Number(data.isFrame) : 1;
    const isCache = data.isCache !== undefined ? Number(data.isCache) : 0;

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

  async update(id: number, data: any, username: string) {
    const parentId = data.parentId !== undefined ? Number(data.parentId) : 0;
    const orderNum = data.orderNum !== undefined ? Number(data.orderNum) : 0;
    const isFrame = data.isFrame !== undefined ? Number(data.isFrame) : 1;
    const isCache = data.isCache !== undefined ? Number(data.isCache) : 0;
    
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

  async remove(id: number) {
    return this.prisma.sysMenu.delete({ where: { menuId: id } });
  }
}
