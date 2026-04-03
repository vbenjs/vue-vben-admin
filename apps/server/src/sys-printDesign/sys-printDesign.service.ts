import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysPrintDesignService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    return this.prisma.sysPrintDesign.create({
      data: {
        ...data,
        createBy: username,
      },
    });
  }

  async findAll(_params: any) {
    const where: any = {};

    return this.prisma.sysPrintDesign.findMany({ where, orderBy: { createTime: 'desc' } });
  }

  async findOne(id: number) {
    return this.prisma.sysPrintDesign.findUnique({ where: { printId: id } });
  }

  async remove(id: number) {
    return this.prisma.sysPrintDesign.delete({ where: { printId: id } });
  }

  async update(id: number, data: any, username: string) {
    return this.prisma.sysPrintDesign.update({
      where: { printId: id },
      data: {
        ...data,
        updateBy: username,
      },
    });
  }
}
