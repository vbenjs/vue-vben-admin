import type { AppRequestContext } from '../common/request-context/request-context.types';

import { BadRequestException, Injectable } from '@nestjs/common';

import { FinanceWorkflowService } from '../finance-workflow/finance-workflow.service';
import { PrismaService } from '../prisma/prisma.service';

function getYearRange(fiscalYear?: string) {
  if (!fiscalYear || !/^\d{4}$/.test(fiscalYear)) return null;
  const start = new Date(`${fiscalYear}-01-01T00:00:00.000Z`);
  const end = new Date(`${Number(fiscalYear) + 1}-01-01T00:00:00.000Z`);
  return { gte: start, lt: end };
}

@Injectable()
export class ProcurementResultService {
  constructor(
    private readonly financeWorkflowService: FinanceWorkflowService,
    private readonly prisma: PrismaService,
  ) {}

  async create(data: any, username: string) {
    const payload = this.normalizePayload(data);
    const result = await this.prisma.procurementResult.create({
      data: { ...payload, createBy: username },
    });
    return this.serialize(result);
  }

  async findAll(
    params: {
      applyNo?: string;
      fiscalYear?: string;
      inputStatus?: string;
      page?: number;
      pageSize?: number;
      projectName?: string;
      status?: string;
    },
    requestContext: AppRequestContext = {},
  ) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 10;
    const skip = (page - 1) * pageSize;
    const fiscalYear = (params.fiscalYear || requestContext.fiscalYear || '').trim();
    const dateWhere = getYearRange(fiscalYear);
    const where = {
      ...(dateWhere ? { createTime: dateWhere } : {}),
      ...(params.applyNo ? { applyNo: { contains: params.applyNo } } : {}),
      ...(params.projectName ? { projectName: { contains: params.projectName } } : {}),
      ...(params.inputStatus ? { inputStatus: params.inputStatus } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.procurementResult.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.procurementResult.count({ where }),
    ]);
    return {
      context: {
        fiscalYear,
        tenantId: requestContext.tenantId,
        tenantName: requestContext.tenantName || '',
      },
      items: items.map((item) => this.serialize(item)),
      total,
    };
  }

  async findOne(id: bigint) {
    const result = await this.prisma.procurementResult.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }

  async getHistory(id: bigint) {
    const record = await this.requireProcurementResult(id);
    return this.financeWorkflowService.getHistory({ businessNo: this.getBusinessNo(record) });
  }

  async submit(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireProcurementResult(id);
    if (record.flowStatus === '1') {
      throw new BadRequestException('当前采购结果已送审，无需重复提交');
    }

    return this.financeWorkflowService.executeCommand(
      'submit',
      {
        businessId: record.id.toString(),
        businessNo: this.getBusinessNo(record),
        businessType: 'procurement-result',
        currentNode: '申请节点',
        title: record.projectName || this.getBusinessNo(record),
      },
      actor,
    );
  }

  async withdraw(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireProcurementResult(id);
    if (record.flowStatus !== '1') {
      throw new BadRequestException('当前采购结果未送审，无法撤回');
    }

    return this.financeWorkflowService.executeCommand(
      'withdraw',
      {
        businessId: record.id.toString(),
        businessNo: this.getBusinessNo(record),
        businessType: 'procurement-result',
        currentNode: '申请节点',
        title: record.projectName || this.getBusinessNo(record),
      },
      actor,
    );
  }

  async update(id: bigint, data: any, username: string) {
    const payload = this.normalizePayload(data);
    const result = await this.prisma.procurementResult.update({
      where: { id },
      data: { ...payload, updateBy: username },
    });
    return this.serialize(result);
  }

  async remove(id: bigint) {
    const result = await this.prisma.procurementResult.delete({ where: { id } });
    return this.serialize(result);
  }

  private normalizePayload(data: any) {
    return {
      applyId: this.parseBigInt(data.applyId),
      applyNo: data.applyNo || '',
      creditCode: data.creditCode || '',
      flowStatus: data.flowStatus || '0',
      inputStatus: data.inputStatus || '0',
      projectName: data.projectName || '',
      remark: data.remark || '',
      status: data.status || '0',
      winBidAmount: data.winBidAmount ?? 0,
      winBidSupplier: data.winBidSupplier || '',
    } as any;
  }

  private parseBigInt(value?: number | string) {
    if (value === undefined || value === null || value === '') return undefined;
    return BigInt(value);
  }

  private getBusinessNo(record: { id: bigint; applyNo?: null | string }) {
    const applyNo = `${record.applyNo || ''}`.trim();
    return applyNo || `procurement-result-${record.id.toString()}`;
  }

  private async requireProcurementResult(id: bigint) {
    const record = await this.prisma.procurementResult.findUnique({ where: { id } });
    if (!record) {
      throw new BadRequestException('采购结果不存在');
    }
    return record;
  }

  private serialize(item: any) {
    return { ...item, applyId: item.applyId?.toString(), id: item.id.toString() };
  }
}
