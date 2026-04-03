import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysApprovalProcessService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    const res = await this.prisma.sysApprovalProcess.create({
      data: {
        ...data,
        formId: data.formId ? BigInt(data.formId) : null,
        createBy: username,
      },
    });
    return { ...res, processId: res.processId.toString(), formId: res.formId?.toString() };
  }

  async findAll(params: { processName?: string; skip?: number; status?: string; take?: number }) {
    const { skip, take, processName, status } = params;

    const where = {
      ...(processName ? { processName: { contains: processName } } : {}),
      ...(status ? { status } : {}),
    };

    const items = await this.prisma.sysApprovalProcess.findMany({
      skip,
      take,
      where,
      orderBy: { createTime: 'desc' },
    });

    const serializedItems = items.map((item) => ({
      ...item,
      processId: item.processId.toString(),
      formId: item.formId?.toString(),
    }));

    const total = await this.prisma.sysApprovalProcess.count({ where });

    return { items: serializedItems, total };
  }

  async findOne(id: number) {
    const item = await this.prisma.sysApprovalProcess.findUnique({
      where: { processId: BigInt(id) },
    });
    return item
      ? { ...item, processId: item.processId.toString(), formId: item.formId?.toString() }
      : null;
  }

  async remove(id: number) {
    const res = await this.prisma.sysApprovalProcess.delete({ where: { processId: BigInt(id) } });
    return { ...res, processId: res.processId.toString(), formId: res.formId?.toString() };
  }

  async update(id: number, data: any, username: string) {
    const res = await this.prisma.sysApprovalProcess.update({
      where: { processId: BigInt(id) },
      data: {
        ...data,
        formId: data.formId ? BigInt(data.formId) : null,
        updateBy: username,
      },
    });
    return { ...res, processId: res.processId.toString(), formId: res.formId?.toString() };
  }
}
