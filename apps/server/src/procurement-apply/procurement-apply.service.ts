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
export class ProcurementApplyService {
  constructor(
    private readonly financeWorkflowService: FinanceWorkflowService,
    private readonly prisma: PrismaService,
  ) {}

  async create(data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const result = await this.prisma.procurementApply.create({
      data: { ...payload, createBy: username },
    });
    return this.serialize(result);
  }

  async findAll(
    params: {
      applyNo?: string;
      fiscalYear?: string;
      flowStatus?: string;
      page?: number;
      pageSize?: number;
      procureType?: string;
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
      ...(dateWhere ? { applyDate: dateWhere } : {}),
      ...(params.applyNo ? { applyNo: { contains: params.applyNo } } : {}),
      ...(params.procureType ? { procureType: { contains: params.procureType } } : {}),
      ...(params.projectName ? { projectName: { contains: params.projectName } } : {}),
      ...(params.flowStatus ? { flowStatus: params.flowStatus } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.procurementApply.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.procurementApply.count({ where }),
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
    const result = await this.prisma.procurementApply.findUnique({ where: { id } });
    return result ? this.serialize(result) : null;
  }

  async getHistory(id: bigint) {
    const record = await this.requireProcurementApply(id);
    return this.financeWorkflowService.getHistory({ businessNo: this.getBusinessNo(record) });
  }

  async submit(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireProcurementApply(id);
    if (record.flowStatus === '1') {
      throw new BadRequestException('当前采购申报已送审，无需重复提交');
    }

    return this.financeWorkflowService.executeCommand(
      'submit',
      {
        businessId: record.id.toString(),
        businessNo: this.getBusinessNo(record),
        businessType: 'procurement-apply',
        currentNode: record.bizNode || '申请节点',
        title: record.projectName || this.getBusinessNo(record),
      },
      actor,
    );
  }

  async withdraw(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireProcurementApply(id);
    if (record.flowStatus !== '1') {
      throw new BadRequestException('当前采购申报未送审，无法撤回');
    }

    return this.financeWorkflowService.executeCommand(
      'withdraw',
      {
        businessId: record.id.toString(),
        businessNo: this.getBusinessNo(record),
        businessType: 'procurement-apply',
        currentNode: record.bizNode || '申请节点',
        title: record.projectName || this.getBusinessNo(record),
      },
      actor,
    );
  }

  async update(id: bigint, data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const result = await this.prisma.procurementApply.update({
      where: { id },
      data: { ...payload, updateBy: username },
    });
    return this.serialize(result);
  }

  async remove(id: bigint) {
    const result = await this.prisma.procurementApply.delete({ where: { id } });
    return this.serialize(result);
  }

  private normalizePayload(data: any, requestContext: AppRequestContext) {
    return {
      applyDate: this.parseDate(data.applyDate, requestContext.fiscalYear),
      applyNo: data.applyNo || '',
      bizNode: data.bizNode || '',
      deptName: data.deptName || '',
      fillType: data.fillType || '',
      flowStatus: data.flowStatus || '0',
      isAborted: data.isAborted || '0',
      operatorName: data.operatorName || '',
      procureAmount: data.procureAmount ?? 0,
      procureMethod: data.procureMethod || '',
      procureType: data.procureType || '',
      projectName: data.projectName || '',
      remark: data.remark || '',
      status: data.status || '0',
      unitName: data.unitName || '',
    } as any;
  }

  private parseDate(value?: string, fallbackFiscalYear?: string) {
    if (value) return new Date(value);
    if (fallbackFiscalYear && /^\d{4}$/.test(fallbackFiscalYear))
      return new Date(`${fallbackFiscalYear}-01-01T00:00:00.000Z`);
    return undefined;
  }

  private getBusinessNo(record: { id: bigint; applyNo?: null | string }) {
    const applyNo = `${record.applyNo || ''}`.trim();
    return applyNo || `procurement-apply-${record.id.toString()}`;
  }

  private async requireProcurementApply(id: bigint) {
    const record = await this.prisma.procurementApply.findUnique({ where: { id } });
    if (!record) {
      throw new BadRequestException('采购申报不存在');
    }
    return record;
  }

  private serialize(item: any) {
    return { ...item, deptId: item.deptId?.toString(), id: item.id.toString() };
  }
}
