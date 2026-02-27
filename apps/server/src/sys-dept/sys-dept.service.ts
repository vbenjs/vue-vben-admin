import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysDeptService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { deptName?: string; status?: string }) {
    const { deptName, status } = params;
    const where = {
      ...(deptName ? { deptName: { contains: deptName } } : {}),
      ...(status ? { status } : {}),
    };

    return this.prisma.sysDept.findMany({
      where,
      orderBy: { orderNum: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.sysDept.findUnique({ where: { deptId: id } });
  }

  async create(data: any, username: string) {
    const parentId = data.parentId !== undefined ? Number(data.parentId) : 0;
    const orderNum = data.orderNum !== undefined ? Number(data.orderNum) : 0;
    return this.prisma.sysDept.create({
      data: {
        ...data,
        parentId,
        orderNum,
        createBy: username,
      },
    });
  }

  async update(id: number, data: any, username: string) {
    const parentId = data.parentId !== undefined ? Number(data.parentId) : 0;
    const orderNum = data.orderNum !== undefined ? Number(data.orderNum) : 0;
    // Remove deptId, key, children, parent etc to prevent Prisma error "Unknown argument X"
    const { deptId, key, children, parent, title, value, ...updateData } = data;
    return this.prisma.sysDept.update({
      where: { deptId: id },
      data: {
        ...updateData,
        parentId,
        orderNum,
        updateBy: username,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.sysDept.delete({ where: { deptId: id } });
  }
}
