import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysDocCodeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { skip?: number; take?: number; ruleCode?: string; ruleName?: string }) {
    const { skip, take, ruleCode, ruleName } = params;
    
    const where = {
      ...(ruleCode ? { ruleCode: { contains: ruleCode } } : {}),
      ...(ruleName ? { ruleName: { contains: ruleName } } : {}),
    };

    const items = await this.prisma.sysDocCode.findMany({
      skip,
      take,
      where,
      orderBy: { createTime: 'desc' },
    });

    const serializedItems = items.map(item => ({
      ...item,
      currentVal: item.currentVal.toString(),
    }));

    const total = await this.prisma.sysDocCode.count({ where });

    return { items: serializedItems, total };
  }

  async findOne(id: number) {
    const item = await this.prisma.sysDocCode.findUnique({ where: { id } });
    return item ? { ...item, currentVal: item.currentVal.toString() } : null;
  }

  async create(data: any, username: string) {
    const preparedData = { ...data, createBy: username };
    // remove currentVal as it will be bigInt default
    if (preparedData.currentVal !== undefined) {
        preparedData.currentVal = BigInt(preparedData.currentVal);
    }
    const res = await this.prisma.sysDocCode.create({
      data: preparedData,
    });
    return { ...res, currentVal: res.currentVal.toString() };
  }

  async update(id: number, data: any, username: string) {
    const preparedData = { ...data, updateBy: username };
    if (preparedData.currentVal !== undefined) {
        preparedData.currentVal = BigInt(preparedData.currentVal);
    }
    const res = await this.prisma.sysDocCode.update({
      where: { id },
      data: preparedData,
    });
    return { ...res, currentVal: res.currentVal.toString() };
  }

  async remove(id: number) {
    const res = await this.prisma.sysDocCode.delete({ where: { id } });
    return { ...res, currentVal: res.currentVal.toString() };
  }
}
