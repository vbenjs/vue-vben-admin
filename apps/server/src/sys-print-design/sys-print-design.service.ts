import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysPrintDesignService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    const res = await this.prisma.sysPrintDesign.create({
      data: {
        ...data,
        createBy: username,
      },
    });
    return { ...res, printId: res.printId.toString() };
  }

  async findAll(params: { printName?: string; skip?: number; status?: string; take?: number }) {
    const { skip, take, printName, status } = params;

    const where = {
      ...(printName ? { printName: { contains: printName } } : {}),
      ...(status ? { status } : {}),
    };

    const items = await this.prisma.sysPrintDesign.findMany({
      skip,
      take,
      where,
      orderBy: { createTime: 'desc' },
    });

    const serializedItems = items.map((item) => ({
      ...item,
      printId: item.printId.toString(),
    }));

    const total = await this.prisma.sysPrintDesign.count({ where });

    return { items: serializedItems, total };
  }

  async findOne(id: number) {
    const item = await this.prisma.sysPrintDesign.findUnique({ where: { printId: BigInt(id) } });
    return item ? { ...item, printId: item.printId.toString() } : null;
  }

  async remove(id: number) {
    const res = await this.prisma.sysPrintDesign.delete({ where: { printId: BigInt(id) } });
    return { ...res, printId: res.printId.toString() };
  }

  async update(id: number, data: any, username: string) {
    const res = await this.prisma.sysPrintDesign.update({
      where: { printId: BigInt(id) },
      data: {
        ...data,
        updateBy: username,
      },
    });
    return { ...res, printId: res.printId.toString() };
  }
}
