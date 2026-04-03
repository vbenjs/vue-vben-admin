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
export class ContractService {
  constructor(
    private readonly financeWorkflowService: FinanceWorkflowService,
    private readonly prisma: PrismaService,
  ) {}

  async create(data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const result = await this.prisma.contract.create({ data: { ...payload, createBy: username } });
    return this.serialize(result);
  }

  async findAll(
    params: {
      fiscalYear?: string;
      page?: number;
      pageSize?: number;
      contractName?: string;
      contractNo?: string;
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
      ...(dateWhere ? { signDate: dateWhere } : {}),
      ...(params.contractName ? { contractName: { contains: params.contractName } } : {}),
      ...(params.contractNo ? { contractNo: { contains: params.contractNo } } : {}),
      ...(params.flowStatus ? { flowStatus: params.flowStatus } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.contract.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.contract.count({ where }),
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
    const result = await this.prisma.contract.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }

  async getHistory(id: bigint) {
    const record = await this.requireContract(id);
    return this.financeWorkflowService.getHistory({ businessNo: this.getBusinessNo(record) });
  }

  async submit(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireContract(id);
    if (record.flowStatus === '1') {
      throw new BadRequestException('当前合同已送审，无需重复提交');
    }

    return this.financeWorkflowService.executeCommand(
      'submit',
      {
        businessId: record.id.toString(),
        businessNo: this.getBusinessNo(record),
        businessType: 'contract',
        currentNode: record.bizNode || '申请节点',
        title: record.contractName || this.getBusinessNo(record),
      },
      actor,
    );
  }

  async withdraw(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireContract(id);
    if (record.flowStatus !== '1') {
      throw new BadRequestException('当前合同未送审，无法撤回');
    }

    return this.financeWorkflowService.executeCommand(
      'withdraw',
      {
        businessId: record.id.toString(),
        businessNo: this.getBusinessNo(record),
        businessType: 'contract',
        currentNode: record.bizNode || '申请节点',
        title: record.contractName || this.getBusinessNo(record),
      },
      actor,
    );
  }

  async update(id: bigint, data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const result = await this.prisma.contract.update({
      where: { id },
      data: { ...payload, updateBy: username },
    });
    return this.serialize(result);
  }

  async remove(id: bigint) {
    const result = await this.prisma.contract.delete({ where: { id } });
    return this.serialize(result);
  }

  private normalizePayload(data: any, requestContext: AppRequestContext) {
    const contractAmount = data.contractAmount ?? 0;
    const settlementAmount = data.settlementAmount ?? 0;
    const expenseUsedAmount = data.expenseUsedAmount ?? 0;
    const unexpenseAmount =
      data.unexpenseAmount !== undefined && data.unexpenseAmount !== ''
        ? data.unexpenseAmount
        : Number(contractAmount || 0) - Number(expenseUsedAmount || 0);
    return {
      acceptanceStatus: data.acceptanceStatus || '0',
      acceptanceUser: data.acceptanceUser || '',
      bizNode: data.bizNode || '',
      contractAmount,
      contractApplyNo: data.contractApplyNo || '',
      contractCategory: data.contractCategory || '',
      contractName: data.contractName || '',
      contractNo: data.contractNo || '',
      enterpriseType: data.enterpriseType || '',
      endDate: this.parseDate(data.endDate),
      evaluationStatus: data.evaluationStatus || '0',
      expenseUsedAmount,
      fillType: data.fillType || '',
      flowStatus: data.flowStatus || '0',
      isAborted: data.isAborted || '0',
      isScanUploaded: data.isScanUploaded || '0',
      isSealApplied: data.isSealApplied || '0',
      partyAUnit: data.partyAUnit || '',
      partyBUnit: data.partyBUnit || '',
      procureMethod: data.procureMethod || '',
      procureType: data.procureType || '',
      projectName: data.projectName || '',
      releasedAmount: data.releasedAmount ?? 0,
      remark: data.remark || '',
      settlementAmount,
      signDate: this.parseDate(data.signDate, requestContext.fiscalYear),
      startDate: this.parseDate(data.startDate),
      status: data.status || '0',
      unexpenseAmount,
    } as any;
  }

  private parseDate(value?: string, fallbackFiscalYear?: string) {
    if (value) return new Date(value);
    if (fallbackFiscalYear && /^\d{4}$/.test(fallbackFiscalYear))
      return new Date(`${fallbackFiscalYear}-01-01T00:00:00.000Z`);
    return undefined;
  }

  private getBusinessNo(record: {
    id: bigint;
    contractApplyNo?: null | string;
    contractNo?: null | string;
  }) {
    const contractNo = `${record.contractNo || ''}`.trim();
    const contractApplyNo = `${record.contractApplyNo || ''}`.trim();
    return contractNo || contractApplyNo || `contract-${record.id.toString()}`;
  }

  private async requireContract(id: bigint) {
    const record = await this.prisma.contract.findUnique({ where: { id } });
    if (!record) {
      throw new BadRequestException('合同不存在');
    }
    return record;
  }

  private serialize(item: any) {
    return { ...item, id: item.id.toString() };
  }
}
