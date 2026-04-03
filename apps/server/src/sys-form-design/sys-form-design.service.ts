import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysFormDesignService {
  constructor(private readonly prisma: PrismaService) {}

  async createPageMeta(data: any, username: string) {
    const payload = this.normalizePageMetaPayload(data);
    return this.create(payload, username);
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

  async findAll(params: {
    formName?: string;
    formType?: string;
    skip?: number;
    status?: string;
    take?: number;
  }) {
    const { skip, take, formName, formType, status } = params;

    const where = {
      ...(formName ? { formName: { contains: formName } } : {}),
      ...(formType ? { formType } : {}),
      ...(status ? { status } : {}),
    };

    const items = await this.prisma.sysFormDesign.findMany({
      skip,
      take,
      where,
      orderBy: { createTime: 'desc' },
    });

    const serializedItems = items.map((item) => ({
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

  async findPageMetaList(params: {
    formName?: string;
    skip?: number;
    status?: string;
    take?: number;
  }) {
    return this.findAll({ ...params, formType: '2' });
  }

  async findPageMetaOne(id: number) {
    const item = await this.findOne(id);
    if (!item || item.formType !== '2') {
      return null;
    }
    return item;
  }

  async remove(id: number) {
    const res = await this.prisma.sysFormDesign.delete({ where: { formId: BigInt(id) } });
    return { ...res, formId: res.formId.toString() };
  }

  async removePageMeta(id: number) {
    return this.remove(id);
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

  async updatePageMeta(id: number, data: any, username: string) {
    const payload = this.normalizePageMetaPayload(data);
    return this.update(id, payload, username);
  }

  private normalizePageMetaPayload(data: any) {
    return {
      formContent: JSON.stringify({
        allowLink: data.allowLink || '0',
        bizSystem: data.bizSystem || '',
        formLayout: data.formLayout || 'list',
        menuName: data.menuName || '',
        pageCode: data.pageCode || '',
        pageName: data.pageName || '',
        pageSchema: data.pageSchema || '',
        pageType: data.pageType || '0',
        relationTable: data.relationTable || '',
        sqlScript: data.sqlScript || '',
      }),
      formName: data.pageName || data.formName || '',
      formType: '2',
      remark: data.remark || '',
      status: data.status || '0',
    };
  }
}

