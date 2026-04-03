import type { AppRequestContext } from '../common/request-context/request-context.types';

import { BadRequestException, Injectable } from '@nestjs/common';

import { FinanceWorkflowService } from '../finance-workflow/finance-workflow.service';
import { InvoiceFolderService } from '../invoice-folder/invoice-folder.service';
import { PrismaService } from '../prisma/prisma.service';

function getYearRange(fiscalYear?: string) {
  if (!fiscalYear || !/^\d{4}$/.test(fiscalYear)) return null;
  const start = new Date(`${fiscalYear}-01-01T00:00:00.000Z`);
  const end = new Date(`${Number(fiscalYear) + 1}-01-01T00:00:00.000Z`);
  return { gte: start, lt: end };
}

@Injectable()
export class ExpenseClaimService {
  constructor(
    private readonly financeWorkflowService: FinanceWorkflowService,
    private readonly invoiceFolderService: InvoiceFolderService,
    private readonly prisma: PrismaService,
  ) {}

  async create(data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const details = this.normalizeDetails(data?.details);
    const claimNo = payload.claimNo || (await this.generateClaimNo(requestContext.fiscalYear));

    const result = await this.prisma.$transaction(async (tx) => {
      const created = await tx.expenseClaim.create({
        data: {
          ...payload,
          claimAmount: this.resolveClaimAmount(payload.claimAmount, details),
          claimNo,
          createBy: username,
        },
      });

      if (details.length > 0) {
        await tx.expenseClaimDetail.createMany({
          data: details.map((item) => ({
            ...item,
            claimId: created.id,
            createBy: username,
          })),
        });
      }

      return created;
    });

    await this.syncInvoiceBinding({
      applicant: payload.applicant,
      billNo: claimNo,
      invoiceNo: payload.invoiceNo,
      userName: username,
    });

    return this.findOne(result.id);
  }

  async findAll(
    params: {
      fiscalYear?: string;
      page?: number;
      pageSize?: number;
      claimNo?: string;
      applicant?: string;
      claimType?: string;
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
      ...(dateWhere ? { claimDate: dateWhere } : {}),
      ...(params.claimNo ? { claimNo: { contains: params.claimNo } } : {}),
      ...(params.applicant ? { applicant: { contains: params.applicant } } : {}),
      ...(params.claimType ? { claimType: params.claimType } : {}),
      ...(params.flowStatus ? { flowStatus: params.flowStatus } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.expenseClaim.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.expenseClaim.count({ where }),
    ]);

    const claimIds = items.map((item) => item.id);
    const detailGroups = await this.prisma.expenseClaimDetail.groupBy({
      by: ['claimId'],
      where: { claimId: { in: claimIds } },
      _count: { claimId: true },
    });
    const detailCountMap = new Map(
      detailGroups.map((item) => [item.claimId?.toString() || '', item._count.claimId]),
    );

    return {
      context: {
        fiscalYear,
        tenantId: requestContext.tenantId,
        tenantName: requestContext.tenantName || '',
      },
      items: items.map((item) =>
        this.serialize({
          ...item,
          detailCount: detailCountMap.get(item.id.toString()) || 0,
        }),
      ),
      total,
    };
  }

  async findOne(id: bigint) {
    const result = await this.prisma.expenseClaim.findUnique({ where: { id } });
    if (!result) {
      return null;
    }

    const details = await this.prisma.expenseClaimDetail.findMany({
      where: { claimId: id },
      orderBy: [{ createTime: 'asc' }, { id: 'asc' }],
    });

    return this.serialize({
      ...result,
      details: details.map((detail) => this.serializeDetail(detail)),
    });
  }

  async update(id: bigint, data: any, username: string, requestContext: AppRequestContext = {}) {
    const payload = this.normalizePayload(data, requestContext);
    const details = this.normalizeDetails(data?.details);

    await this.prisma.$transaction(async (tx) => {
      await tx.expenseClaim.update({
        where: { id },
        data: {
          ...payload,
          claimAmount: this.resolveClaimAmount(payload.claimAmount, details),
          updateBy: username,
        },
      });

      await tx.expenseClaimDetail.deleteMany({ where: { claimId: id } });
      if (details.length > 0) {
        await tx.expenseClaimDetail.createMany({
          data: details.map((item) => ({
            ...item,
            claimId: id,
            createBy: username,
            updateBy: username,
          })),
        });
      }
    });

    await this.syncInvoiceBinding({
      applicant: payload.applicant,
      billNo: payload.claimNo,
      invoiceNo: payload.invoiceNo,
      userName: username,
    });

    return this.findOne(id);
  }

  async remove(id: bigint) {
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.expenseClaimDetail.deleteMany({ where: { claimId: id } });
      return tx.expenseClaim.delete({ where: { id } });
    });
    return this.serialize(result);
  }

  async getHistory(id: bigint) {
    const record = await this.requireExpenseClaim(id);
    return this.financeWorkflowService.getHistory({ businessNo: record.claimNo || '' });
  }

  async submit(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireExpenseClaim(id);
    if (record.flowStatus === '1') {
      throw new BadRequestException('当前报销单已送审，无需重复提交');
    }

    return this.financeWorkflowService.executeCommand(
      'submit',
      {
        businessId: record.id.toString(),
        businessNo: record.claimNo || '',
        businessType: 'expense-claim',
        currentNode: '申请节点',
        title: record.claimType || record.claimNo || '',
      },
      actor,
    );
  }

  async withdraw(id: bigint, actor: { realName?: string; userId?: string; username?: string }) {
    const record = await this.requireExpenseClaim(id);
    if (record.flowStatus !== '1') {
      throw new BadRequestException('当前报销单未送审，无法撤回');
    }

    return this.financeWorkflowService.executeCommand(
      'withdraw',
      {
        businessId: record.id.toString(),
        businessNo: record.claimNo || '',
        businessType: 'expense-claim',
        currentNode: record.flowNode || '申请节点',
        title: record.claimType || record.claimNo || '',
      },
      actor,
    );
  }

  private async requireExpenseClaim(id: bigint) {
    const record = await this.prisma.expenseClaim.findUnique({ where: { id } });
    if (!record) {
      throw new BadRequestException('报销单不存在');
    }
    return record;
  }

  private normalizePayload(data: any, requestContext: AppRequestContext) {
    return {
      applicant: data.applicant || '',
      attachPages: data.attachPages ?? 0,
      claimAmount: data.claimAmount ?? 0,
      claimAmountUpper: data.claimAmountUpper || '',
      claimDate: this.parseDate(data.claimDate, requestContext.fiscalYear),
      claimNo: data.claimNo || '',
      claimType: data.claimType || '',
      companionCount: data.companionCount ?? 0,
      contractInfo: data.contractInfo || '',
      deptName: data.deptName || '',
      fillDate: this.parseDate(data.fillDate),
      fillerName: data.fillerName || '',
      flowNode: data.flowNode || '',
      flowStatus: data.flowStatus || '0',
      fundUsage: data.fundUsage || '',
      hasEInvoice: data.hasEInvoice || '0',
      indicatorInfo: data.indicatorInfo || '',
      invoiceNo: data.invoiceNo || '',
      isContract: data.isContract || '0',
      loanTotal: data.loanTotal ?? 0,
      offsetAmount: data.offsetAmount ?? 0,
      payableAmount: data.payableAmount ?? 0,
      receptionCount: data.receptionCount ?? 0,
      receptionDays: data.receptionDays ?? 0,
      receptionPlace: data.receptionPlace || '',
      receptionStandard: data.receptionStandard ?? 0,
      receptionTarget: data.receptionTarget || '',
      refundAmount: data.refundAmount ?? 0,
      remark: data.remark || '',
      standardLimit: data.standardLimit ?? 0,
      standardType: data.standardType || '',
      status: data.status || '0',
      travelDays: data.travelDays ?? 0,
      travelEndDate: this.parseDate(data.travelEndDate),
      travelReason: data.travelReason || '',
      travelStartDate: this.parseDate(data.travelStartDate),
    } as any;
  }

  private normalizeDetails(details: any) {
    if (!Array.isArray(details)) {
      return [];
    }

    return details
      .map((item) => ({
        airFare: item?.airFare ?? 0,
        accommodation: item?.accommodation ?? 0,
        applyAmount: item?.applyAmount ?? item?.subtotal ?? 0,
        cityTransport: item?.cityTransport ?? 0,
        econCategory: item?.econCategory || '',
        indicatorId: item?.indicatorId ? BigInt(item.indicatorId) : undefined,
        indicatorName: item?.indicatorName || '',
        localTransport: item?.localTransport ?? 0,
        mealAllowance: item?.mealAllowance ?? 0,
        otherExpense: item?.otherExpense ?? 0,
        realEconCategory: item?.realEconCategory || '',
        realIndicatorId: item?.realIndicatorId ? BigInt(item.realIndicatorId) : undefined,
        remainAmount: item?.remainAmount ?? 0,
        remark: item?.remark || '',
        status: item?.status || '0',
        subtotal: item?.subtotal ?? item?.applyAmount ?? 0,
        travelDays: item?.travelDays ?? 0,
        travelEndDate: this.parseDate(item?.travelEndDate),
        travelFrom: item?.travelFrom || '',
        travelLevel: item?.travelLevel || '',
        travelPersons: item?.travelPersons ?? 0,
        travelStartDate: this.parseDate(item?.travelStartDate),
        travelTo: item?.travelTo || '',
        usage: item?.usage || '',
      }))
      .filter(
        (item) =>
          item.usage ||
          item.indicatorName ||
          Number(item.applyAmount || 0) > 0 ||
          Number(item.subtotal || 0) > 0,
      );
  }

  private resolveClaimAmount(claimAmount: unknown, details: Array<{ subtotal?: number }>) {
    const normalizedClaimAmount = Number(claimAmount || 0);
    if (normalizedClaimAmount > 0) {
      return normalizedClaimAmount;
    }
    return details.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
  }

  private async generateClaimNo(fiscalYear?: string) {
    const now = new Date();
    const year = fiscalYear && /^\d{4}$/.test(fiscalYear) ? fiscalYear : `${now.getFullYear()}`;
    const stamp = `${now.getMonth() + 1}`.padStart(2, '0') + `${now.getDate()}`.padStart(2, '0');
    const prefix = `BX${year}${stamp}`;
    const count = await this.prisma.expenseClaim.count({
      where: {
        claimNo: {
          startsWith: prefix,
        },
      },
    });
    return `${prefix}${`${count + 1}`.padStart(4, '0')}`;
  }

  private async syncInvoiceBinding(params: {
    applicant?: string;
    billNo?: string;
    invoiceNo?: string;
    userName?: string;
  }) {
    const invoiceNos = `${params.invoiceNo || ''}`
      .split(/[，,;；\s]+/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (invoiceNos.length === 0) {
      return;
    }

    await this.invoiceFolderService.syncInvoicesByNos({
      applicant: params.applicant,
      billNo: params.billNo,
      invoiceNos,
      useStatus: '1',
      userName: params.userName,
    });
  }

  private parseDate(value?: string, fallbackFiscalYear?: string) {
    if (value) return new Date(value);
    if (fallbackFiscalYear && /^\d{4}$/.test(fallbackFiscalYear)) {
      return new Date(`${fallbackFiscalYear}-01-01T00:00:00.000Z`);
    }
    return undefined;
  }

  private serialize(item: any) {
    if (!item) {
      return item;
    }
    return {
      ...item,
      id: item.id?.toString?.() || item.id,
      deptId: item.deptId?.toString?.(),
      details: Array.isArray(item.details)
        ? item.details.map((detail: any) => this.serializeDetail(detail))
        : item.details,
    };
  }

  private serializeDetail(item: any) {
    return {
      ...item,
      claimId: item.claimId?.toString?.(),
      id: item.id?.toString?.() || item.id,
      indicatorId: item.indicatorId?.toString?.(),
      realIndicatorId: item.realIndicatorId?.toString?.(),
    };
  }
}
