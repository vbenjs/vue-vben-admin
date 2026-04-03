import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysLogininforService {
  constructor(private readonly prisma: PrismaService) {}

  async clear() {
    return this.prisma.sysLogininfor.deleteMany({});
  }

  async findAll(params: {
    ipaddr?: string;
    skip?: number;
    status?: string;
    take?: number;
    userName?: string;
  }) {
    const { skip, take, userName, ipaddr, status } = params;

    const where = {
      ...(userName ? { userName: { contains: userName } } : {}),
      ...(ipaddr ? { ipaddr: { contains: ipaddr } } : {}),
      ...(status ? { status } : {}),
    };

    const items = await this.prisma.sysLogininfor.findMany({
      skip,
      take,
      where,
      orderBy: { loginTime: 'desc' },
    });

    const serializedItems = items.map((item) => ({
      ...item,
      infoId: item.infoId.toString(),
    }));

    const total = await this.prisma.sysLogininfor.count({ where });

    return { items: serializedItems, total };
  }

  async remove(id: number) {
    const res = await this.prisma.sysLogininfor.delete({ where: { infoId: BigInt(id) } });
    return { ...res, infoId: res.infoId.toString() };
  }
}
