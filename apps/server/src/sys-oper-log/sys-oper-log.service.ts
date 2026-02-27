import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysOperLogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { skip?: number; take?: number; title?: string; operName?: string; status?: number }) {
    const { skip, take, title, operName, status } = params;
    
    const where = {
      ...(title ? { title: { contains: title } } : {}),
      ...(operName ? { operName: { contains: operName } } : {}),
      ...(status !== undefined ? { status: Number(status) } : {}),
    };

    const items = await this.prisma.sysOperLog.findMany({
      skip,
      take,
      where,
      orderBy: { operTime: 'desc' },
    });

    const serializedItems = items.map(item => ({
      ...item,
      operId: item.operId.toString(),
      costTime: item.costTime?.toString(),
    }));

    const total = await this.prisma.sysOperLog.count({ where });

    return { items: serializedItems, total };
  }

  async findOne(id: number) {
    const item = await this.prisma.sysOperLog.findUnique({ where: { operId: BigInt(id) } });
    if (item) {
      return {
        ...item,
        operId: item.operId.toString(),
        costTime: item.costTime?.toString(),
      };
    }
    return null;
  }

  async create(data: any) {
    const res = await this.prisma.sysOperLog.create({
      data: {
        ...data,
      },
    });
    return { ...res, operId: res.operId.toString(), costTime: res.costTime?.toString() };
  }

  async remove(id: number) {
    const res = await this.prisma.sysOperLog.delete({ where: { operId: BigInt(id) } });
    return { ...res, operId: res.operId.toString(), costTime: res.costTime?.toString() };
  }

  async clear() {
    return this.prisma.sysOperLog.deleteMany({});
  }
}
