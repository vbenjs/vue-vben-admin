import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IndicatorTransferService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    return this.serialize(
      await this.prisma.indicatorTransfer.create({
        data: { ...this.normalizePayload(data), createBy: username },
      }),
    );
  }

  async findAll(params: {
    outDeptName?: string;
    page?: number;
    pageSize?: number;
    status?: string;
    transferNo?: string;
  }) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 10;
    const skip = (page - 1) * pageSize;
    const where = {
      ...(params.transferNo ? { transferNo: { contains: params.transferNo } } : {}),
      ...(params.outDeptName ? { outDeptName: { contains: params.outDeptName } } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.indicatorTransfer.findMany({ where, skip, take: pageSize, orderBy: { createTime: 'desc' } }),
      this.prisma.indicatorTransfer.count({ where }),
    ]);
    return { items: items.map((i) => this.serialize(i)), total };
  }

  async findOne(id: bigint) {
    const r = await this.prisma.indicatorTransfer.findUnique({ where: { id } });
    return r ? this.serialize(r) : null;
  }

  async update(id: bigint, data: any, username: string) {
    return this.serialize(
      await this.prisma.indicatorTransfer.update({
        where: { id },
        data: { ...this.normalizePayload(data), updateBy: username },
      }),
    );
  }

  async remove(id: bigint) {
    return this.serialize(await this.prisma.indicatorTransfer.delete({ where: { id } }));
  }

  private normalizePayload(data: any) {
    return {
      inAfterAvailable: data.inAfterAvailable ?? 0,
      inAfterYearTotal: data.inAfterYearTotal ?? 0,
      inBeforeYearTotal: data.inBeforeYearTotal ?? 0,
      inDeptId: data.inDeptId ? BigInt(data.inDeptId) : undefined,
      inDeptName: data.inDeptName || '',
      inEconCategory: data.inEconCategory || '',
      inFuncCategory: data.inFuncCategory || '',
      inFundSource: data.inFundSource || '',
      inIndicatorId: data.inIndicatorId ? BigInt(data.inIndicatorId) : undefined,
      inIndicatorName: data.inIndicatorName || '',
      inIsGovProcure: data.inIsGovProcure || '0',
      inTransferAmount: data.inTransferAmount ?? 0,
      operatorName: data.operatorName || '',
      outAfterAvailable: data.outAfterAvailable ?? 0,
      outAfterYearTotal: data.outAfterYearTotal ?? 0,
      outBeforeYearTotal: data.outBeforeYearTotal ?? 0,
      outDeptId: data.outDeptId ? BigInt(data.outDeptId) : undefined,
      outDeptName: data.outDeptName || '',
      outEconCategory: data.outEconCategory || '',
      outFuncCategory: data.outFuncCategory || '',
      outFundSource: data.outFundSource || '',
      outIndicatorId: data.outIndicatorId ? BigInt(data.outIndicatorId) : undefined,
      outIndicatorName: data.outIndicatorName || '',
      outIsGovProcure: data.outIsGovProcure || '0',
      outTransferAmount: data.outTransferAmount ?? 0,
      remark: data.remark || '',
      status: data.status || '0',
      transferDate: data.transferDate ? new Date(data.transferDate) : undefined,
      transferNo: data.transferNo || '',
      transferTotalAmount: data.transferTotalAmount ?? 0,
    } as any;
  }

  private serialize(item: any) {
    return {
      ...item,
      id: item.id.toString(),
      inDeptId: item.inDeptId?.toString(),
      inIndicatorId: item.inIndicatorId?.toString(),
      outDeptId: item.outDeptId?.toString(),
      outIndicatorId: item.outIndicatorId?.toString(),
    };
  }
}
