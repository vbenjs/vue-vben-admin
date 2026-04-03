import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysFormDataService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const result = await this.prisma.sysFormData.create({
      data: {
        formId: BigInt(data.formId),
        formData: data.formData,
        createBy: data.createBy || 'admin',
        remark: data.remark || '',
      },
    });
    return { ...result, id: result.id.toString(), formId: result.formId.toString() };
  }

  async getById(id: bigint) {
    const item = await this.prisma.sysFormData.findUnique({
      where: { id },
    });
    if (item) {
      return {
        ...item,
        id: item.id.toString(),
        formId: item.formId.toString(),
      };
    }
    return null;
  }

  async getList(page: number, pageSize: number, query: any) {
    const skip = (page - 1) * pageSize;
    const where: any = {};

    if (query.formId) {
      where.formId = BigInt(query.formId);
    }

    if (query.createBy) {
      where.createBy = { contains: query.createBy };
    }

    const [items, total] = await Promise.all([
      this.prisma.sysFormData.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.sysFormData.count({ where }),
    ]);

    // Convert BigInt to string for JSON serialization
    const serializedItems = items.map((item) => ({
      ...item,
      id: item.id.toString(),
      formId: item.formId.toString(),
    }));

    return { items: serializedItems, total };
  }

  async remove(id: bigint) {
    const result = await this.prisma.sysFormData.delete({
      where: { id },
    });
    return { ...result, id: result.id.toString(), formId: result.formId.toString() };
  }

  async update(id: bigint, data: any) {
    const result = await this.prisma.sysFormData.update({
      where: { id },
      data: {
        formData: data.formData,
        updateBy: 'admin',
        remark: data.remark,
      },
    });
    return { ...result, id: result.id.toString(), formId: result.formId.toString() };
  }
}
