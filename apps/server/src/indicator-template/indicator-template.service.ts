import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IndicatorTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    return this.serialize(
      await this.prisma.indicatorTemplate.create({
        data: { ...this.normalizePayload(data), createBy: username },
      }),
    );
  }

  async findAll(params: {
    page?: number;
    pageSize?: number;
    status?: string;
    templateName?: string;
  }) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 10;
    const skip = (page - 1) * pageSize;
    const where = {
      ...(params.templateName ? { templateName: { contains: params.templateName } } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.indicatorTemplate.findMany({ where, skip, take: pageSize, orderBy: { sortOrder: 'asc' } }),
      this.prisma.indicatorTemplate.count({ where }),
    ]);
    return { items: items.map((i) => this.serialize(i)), total };
  }

  async findOne(id: bigint) {
    const r = await this.prisma.indicatorTemplate.findUnique({ where: { id } });
    return r ? this.serialize(r) : null;
  }

  async update(id: bigint, data: any, username: string) {
    return this.serialize(
      await this.prisma.indicatorTemplate.update({
        where: { id },
        data: { ...this.normalizePayload(data), updateBy: username },
      }),
    );
  }

  async remove(id: bigint) {
    return this.serialize(await this.prisma.indicatorTemplate.delete({ where: { id } }));
  }

  private normalizePayload(data: any) {
    return {
      alias: data.alias || '',
      isEnabled: data.isEnabled || '1',
      isRequired: data.isRequired || '0',
      remark: data.remark || '',
      sortOrder: data.sortOrder ?? 0,
      status: data.status || '0',
      templateCode: data.templateCode || '',
      templateName: data.templateName || '',
    } as any;
  }

  private serialize(item: any) {
    return { ...item, id: item.id.toString() };
  }
}
