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
export class ContractReceiptService {
  constructor(
    private readonly financeWorkflowService: FinanceWorkflowService,
    private readonly prisma: PrismaService,
  ) {}

  async create(data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const result = await this.prisma.contractReceipt.create({
      data: { ...payload, createBy: username },
    });
    return this.serialize(result);
  }

  async findAll(
    params: {
      fiscalYear?: string;
      page?: number;
      pageSize?: number;
      contractName?: string;
      receiptNo?: string;
      flowStatus?: string;
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
      ...(dateWhere ? { receiptDate: dateWhere } : {}),
      ...(params.contractName ? { contractName: { contains: params.contractName } } : {}),
      ...(params.receiptNo ? { receiptNo: { contains: params.receiptNo } } : {}),
      ...(params.flowStatus ? { flowStatus: params.flowStatus } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.contractReceipt.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.contractReceipt.count({ where }),
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
    const result = await this.prisma.contractReceipt.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }

  async update(id: bigint, data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const result = await this.prisma.contractReceipt.update({
      where: { id },
      data: { ...payload, updateBy: username },
    });
    return this.serialize(result);
  }

  async remove(id: bigint) {
    const result = await this.prisma.contractReceipt.delete({ where: { id } });
    return this.serialize(result);
  }

  async getHistory(id: bigint) {
    const record = await this.requireContractReceipt(id);
    return this.financeWorkflowService.getHistory({ businessNo: record.receiptNo || '' });
  }

  async submit(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireContractReceipt(id);
    if (record.flowStatus === '1') {
      throw new BadRequestException('当前合同收款已送审，无需重复提交');
    }

    return this.financeWorkflowService.executeCommand(
      'submit',
      {
        businessId: record.id.toString(),
        businessNo: record.receiptNo || '',
        businessType: 'contract-receipt',
        currentNode: '申请节点',
        title: record.contractName || record.receiptNo || '',
      },
      actor,
    );
  }

  async withdraw(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireContractReceipt(id);
    if (record.flowStatus !== '1') {
      throw new BadRequestException('当前合同收款未送审，无法撤回');
    }

    return this.financeWorkflowService.executeCommand(
      'withdraw',
      {
        businessId: record.id.toString(),
        businessNo: record.receiptNo || '',
        businessType: 'contract-receipt',
        currentNode: record.flowNode || '申请节点',
        title: record.contractName || record.receiptNo || '',
      },
      actor,
    );
  }

  private async requireContractReceipt(id: bigint) {
    const record = await this.prisma.contractReceipt.findUnique({ where: { id } });
    if (!record) {
      throw new BadRequestException('合同收款不存在');
    }
    return record;
  }

  private normalizePayload(data: any, requestContext: AppRequestContext) {
    return {
      contractAmount: data.contractAmount ?? 0,
      contractId: data.contractId ? BigInt(data.contractId) : undefined,
      contractName: data.contractName || '',
      contractNo: data.contractNo || '',
      fillDate: this.parseDate(data.fillDate),
      flowNode: data.flowNode || '',
      flowStatus: data.flowStatus || '0',
      operatorName: data.operatorName || '',
      procureMethod: data.procureMethod || '',
      procureType: data.procureType || '',
      receiptAmount: data.receiptAmount ?? 0,
      receiptDate: this.parseDate(data.receiptDate, requestContext.fiscalYear),
      receiptNo: data.receiptNo || '',
      receiptUnit: data.receiptUnit || '',
      remark: data.remark || '',
      status: data.status || '0',
    } as any;
  }

  private parseDate(value?: string, fallbackFiscalYear?: string) {
    if (value) return new Date(value);
    if (fallbackFiscalYear && /^\d{4}$/.test(fallbackFiscalYear)) {
      return new Date(`${fallbackFiscalYear}-01-01T00:00:00.000Z`);
    }
    return undefined;
  }

  private serialize(item: any) {
    return {
      ...item,
      contractId: item.contractId?.toString(),
      id: item.id.toString(),
    };
  }
}
