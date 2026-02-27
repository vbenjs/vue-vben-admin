import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysFormDesignService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { skip?: number; take?: number; formName?: string; status?: string }) {
    const { skip, take, formName, status } = params;
    
    const where = {
      ...(formName ? { formName: { contains: formName } } : {}),
      ...(status ? { status } : {}),
    };

    const items = await this.prisma.sysFormDesign.findMany({
      skip,
      take,
      where,
      orderBy: { createTime: 'desc' },
    });

    const serializedItems = items.map(item => ({
      ...item,
      formId: item.formId.toString(),
    }));

    const total = await this.prisma.sysFormDesign.count({ where });

    return { items: serializedItems, total };
  }

  async findOne(id: number) {
    const item = await this.prisma.sysFormDesign.findUnique({ where: { formId: BigInt(id) } });
    return item ? { ...item, formId: item.formId.toString() } : null;
  }

  async create(data: any, username: string) {
    const res = await this.prisma.sysFormDesign.create({
      data: {
        ...data,
        createBy: username,
      },
    });
    return { ...res, formId: res.formId.toString() };
  }

  async update(id: number, data: any, username: string) {
    const res = await this.prisma.sysFormDesign.update({
      where: { formId: BigInt(id) },
      data: {
        ...data,
        updateBy: username,
      },
    });
    return { ...res, formId: res.formId.toString() };
  }

  async remove(id: number) {
    const res = await this.prisma.sysFormDesign.delete({ where: { formId: BigInt(id) } });
    return { ...res, formId: res.formId.toString() };
  }
}
