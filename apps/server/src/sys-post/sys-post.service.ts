import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysPostService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { skip?: number; take?: number; postCode?: string; postName?: string; status?: string }) {
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

  async create(data: any, username: string) {
    return this.prisma.sysPost.create({
      data: {
        ...data,
        createBy: username,
      },
    });
  }

  async update(id: number, data: any, username: string) {
    return this.prisma.sysPost.update({
      where: { postId: id },
      data: {
        ...data,
        updateBy: username,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.sysPost.delete({ where: { postId: id } });
  }
}
