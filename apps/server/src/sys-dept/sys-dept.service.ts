import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysDeptService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    const parentId = data.parentId === undefined ? 0 : Number(data.parentId);
    const orderNum = data.orderNum === undefined ? 0 : Number(data.orderNum);
    return this.prisma.sysDept.create({
      data: {
        ...data,
        parentId,
        orderNum,
        createBy: username,
      },
    });
  }

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

  /** 获取部门树结构 */
  async getTree(params: { status?: string } = {}) {
    const { status } = params;
    const where = {
      ...(status ? { status } : {}),
    };
    const list = await this.prisma.sysDept.findMany({
      where,
      orderBy: { orderNum: 'asc' },
    });
    return this.buildTree(list);
  }

  /** 将扁平列表转为树结构 */
  private buildTree(list: any[]) {
    const nodeMap = new Map<number, any>();
    const roots: any[] = [];
    list.forEach((item) => {
      nodeMap.set(item.deptId, {
        ...item,
        children: [],
      });
    });
    list.forEach((item) => {
      const current = nodeMap.get(item.deptId);
      const parentId = Number(item.parentId || 0);
      if (parentId > 0 && nodeMap.has(parentId)) {
        nodeMap.get(parentId).children.push(current);
      } else {
        roots.push(current);
      }
    });
    const removeEmptyChildren = (nodes: any[]) => {
      nodes.forEach((node) => {
        if (!node.children?.length) {
          delete node.children;
          return;
        }
        removeEmptyChildren(node.children);
      });
    };
    removeEmptyChildren(roots);
    return roots;
  }

  async findOne(id: number) {
    return this.prisma.sysDept.findUnique({ where: { deptId: id } });
  }

  async remove(id: number) {
    return this.prisma.sysDept.delete({ where: { deptId: id } });
  }

  async update(id: number, data: any, username: string) {
    const parentId = data.parentId === undefined ? 0 : Number(data.parentId);
    const orderNum = data.orderNum === undefined ? 0 : Number(data.orderNum);
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
}
