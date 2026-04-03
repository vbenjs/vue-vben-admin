import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BudgetIndicatorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    return this.serialize(
      await this.prisma.budgetIndicator.create({
        data: { ...this.normalizePayload(data), createBy: username },
      }),
    );
  }

  async findAll(params: {
    deptName?: string;
    indicatorCode?: string;
    indicatorName?: string;
    indicatorType?: string;
    page?: number;
    pageSize?: number;
    projectCategory?: string;
    status?: string;
  }) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 10;
    const skip = (page - 1) * pageSize;
    const where = {
      delFlag: '0',
      ...(params.deptName ? { deptName: { contains: params.deptName } } : {}),
      ...(params.indicatorCode
        ? { indicatorCode: { contains: params.indicatorCode } }
        : {}),
      ...(params.indicatorName ? { indicatorName: { contains: params.indicatorName } } : {}),
      ...(params.indicatorType ? { indicatorType: params.indicatorType } : {}),
      ...(params.projectCategory ? { projectCategory: params.projectCategory } : {}),
      ...(params.status ? { indicatorStatus: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.budgetIndicator.findMany({ where, skip, take: pageSize, orderBy: { createTime: 'desc' } }),
      this.prisma.budgetIndicator.count({ where }),
    ]);
    return { items: items.map((i) => this.serialize(i)), total };
  }

  async findOne(id: bigint) {
    const r = await this.prisma.budgetIndicator.findUnique({ where: { id } });
    return r ? this.serialize(r) : null;
  }

  async update(id: bigint, data: any, username: string) {
    return this.serialize(
      await this.prisma.budgetIndicator.update({
        where: { id },
        data: { ...this.normalizePayload(data), updateBy: username },
      }),
    );
  }

  async remove(id: bigint) {
    // 软删除
    return this.serialize(
      await this.prisma.budgetIndicator.update({
        where: { id },
        data: { delFlag: '1' },
      }),
    );
  }

  private normalizePayload(data: any) {
    return {
      accountSubject: data.accountSubject || '',
      authDeptName: data.authDeptName || '',
      availableAmount: data.availableAmount ?? 0,
      budgetTotalAmount: data.budgetTotalAmount ?? 0,
      deptId: data.deptId ? BigInt(data.deptId) : undefined,
      deptName: data.deptName || '',
      econCategory: data.econCategory || '',
      expendCategory: data.expendCategory || '',
      frozenAmount: data.frozenAmount ?? 0,
      funcCategory: data.funcCategory || '',
      fundSource: data.fundSource || '',
      fundNature: data.fundNature || '',
      govEconCategory: data.govEconCategory || '',
      deptEconCategory: data.deptEconCategory || '',
      incomeMethod: data.incomeMethod || '',
      indicatorCode: data.indicatorCode || '',
      indicatorDocNo: data.indicatorDocNo || '',
      indicatorName: data.indicatorName || '',
      indicatorSource: data.indicatorSource || '',
      indicatorStatus: data.indicatorStatus || '0',
      indicatorType: data.indicatorType || '1',
      isAllowTransfer: data.isAllowTransfer || '1',
      isFrozen: data.isFrozen || '0',
      isGovProcure: data.isGovProcure || '0',
      isPreApply: data.isPreApply || '0',
      level1Id: data.level1Id ? BigInt(data.level1Id) : undefined,
      level2Id: data.level2Id ? BigInt(data.level2Id) : undefined,
      paidAmount: data.paidAmount ?? 0,
      procureCategory: data.procureCategory || '',
      projectCategory: data.projectCategory || '',
      remark: data.remark || '',
      subProjectName: data.subProjectName || '',
      transferInAmount: data.transferInAmount ?? 0,
      transferOutAmount: data.transferOutAmount ?? 0,
      yearBeginAmount: data.yearBeginAmount ?? 0,
      yearTotalAmount: data.yearTotalAmount ?? 0,
    } as any;
  }

  private serialize(item: any) {
    return {
      ...item,
      deptId: item.deptId?.toString(),
      id: item.id.toString(),
      level1Id: item.level1Id?.toString(),
      level2Id: item.level2Id?.toString(),
      researchProjectId: item.researchProjectId?.toString(),
    };
  }
}
