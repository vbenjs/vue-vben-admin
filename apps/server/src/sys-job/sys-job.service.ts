import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysJobService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    const res = await this.prisma.sysJob.create({
      data: {
        ...data,
        createBy: username,
      },
    });
    return { ...res, jobId: res.jobId.toString() };
  }

  async findAll(params: {
    jobGroup?: string;
    jobName?: string;
    skip?: number;
    status?: string;
    take?: number;
  }) {
    const { skip, take, jobName, jobGroup, status } = params;

    const where = {
      ...(jobName ? { jobName: { contains: jobName } } : {}),
      ...(jobGroup ? { jobGroup } : {}),
      ...(status ? { status } : {}),
    };

    const items = await this.prisma.sysJob.findMany({
      skip,
      take,
      where,
      orderBy: { createTime: 'desc' },
    });

    const serializedItems = items.map((item) => ({
      ...item,
      jobId: item.jobId.toString(),
    }));

    const total = await this.prisma.sysJob.count({ where });

    return { items: serializedItems, total };
  }

  async findOne(id: number) {
    const item = await this.prisma.sysJob.findUnique({ where: { jobId: BigInt(id) } });
    return item ? { ...item, jobId: item.jobId.toString() } : null;
  }

  async remove(id: number) {
    const res = await this.prisma.sysJob.delete({ where: { jobId: BigInt(id) } });
    return { ...res, jobId: res.jobId.toString() };
  }

  async update(id: number, data: any, username: string) {
    const res = await this.prisma.sysJob.update({
      where: { jobId: BigInt(id) },
      data: {
        ...data,
        updateBy: username,
      },
    });
    return { ...res, jobId: res.jobId.toString() };
  }
}
