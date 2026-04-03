import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysPostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    return this.prisma.sysPost.create({
      data: {
        ...data,
        createBy: username,
      },
    });
  }

  async findAll(params: {
    postCode?: string;
    postName?: string;
    skip?: number;
    status?: string;
    take?: number;
  }) {
    const { skip, take, postCode, postName, status } = params;
    const where = {
      ...(postCode ? { postCode: { contains: postCode } } : {}),
      ...(postName ? { postName: { contains: postName } } : {}),
      ...(status ? { status } : {}),
    };

    const items = await this.prisma.sysPost.findMany({
      skip,
      take,
      where,
      orderBy: { postSort: 'asc' },
    });
    const total = await this.prisma.sysPost.count({ where });

    return { items, total };
  }

  async findOne(id: number) {
    return this.prisma.sysPost.findUnique({ where: { postId: id } });
  }

  async remove(id: number) {
    return this.prisma.sysPost.delete({ where: { postId: id } });
  }

  async update(id: number, data: any, username: string) {
    const { postId, key, children, parent, title, value, ...updateData } = data;
    return this.prisma.sysPost.update({
      where: { postId: id },
      data: {
        ...updateData,
        updateBy: username,
      },
    });
  }
}
