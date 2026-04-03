import type { AppRequestContext } from '../common/request-context/request-context.types';
import type { ExpensePayee, ExpensePayer, PaymentMethod } from '@prisma/client';

import { BadRequestException, Injectable } from '@nestjs/common';

import { pickFirstNumber, pickFirstString } from '../finance-common/finance-legacy-record.util';
import { LegacySqlService } from '../legacy-sql/legacy-sql.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinancePaymentService {
  constructor(
    private readonly legacySqlService: LegacySqlService,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(
    params: {
      billNo?: string;
      keyword?: string;
      page?: number;
      pageSize?: number;
      status?: string;
    },
    requestContext: AppRequestContext = {},
  ) {
    if (!this.shouldUseLegacySource()) {
      return {
        context: {
          fiscalYear: requestContext.fiscalYear || '',
          tenantId: requestContext.tenantId,
          tenantName: requestContext.tenantName || '',
        },
        items: [],
        total: 0,
      };
    }

    const result = await this.legacySqlService.executeNamedQuery('payment-list', {
      billNo: params.billNo,
      fiscalYear: requestContext.fiscalYear,
      keyword: params.keyword,
      page: params.page,
      pageSize: params.pageSize,
      status: params.status,
      tenantId: requestContext.tenantId,
    });
    const enrichedItems = await this.attachExactPaymentFields(result.items);

    return {
      context: {
        fiscalYear: requestContext.fiscalYear || '',
        tenantId: requestContext.tenantId,
        tenantName: requestContext.tenantName || '',
      },
      items: enrichedItems.map((item, index) =>
        this.serializeListItem(item, params.page || 1, params.pageSize || 20, index),
      ),
      total: result.total,
    };
  }

  async getDetail(billNo: string, requestContext: AppRequestContext = {}) {
    const normalizedBillNo = `${billNo || ''}`.trim();
    if (!normalizedBillNo) {
      throw new BadRequestException('billNo 不能为空');
    }

    if (!this.shouldUseLegacySource()) {
      return {
        billNo: normalizedBillNo,
        items: [],
        total: 0,
      };
    }

    const result = await this.legacySqlService.executeNamedQuery('payment-bill-list', {
      billNo: normalizedBillNo,
      page: 1,
      pageSize: 100,
      tenantId: requestContext.tenantId,
    });
    const enrichedItems = await this.attachExactPaymentDetailFields(result.items);

    return {
      billNo: normalizedBillNo,
      items: enrichedItems,
      total: result.total,
    };
  }

  private shouldUseLegacySource() {
    if (typeof this.legacySqlService.getStatus !== 'function') {
      return true;
    }

    const status = this.legacySqlService.getStatus();
    return Boolean(status.enabled && status.configured);
  }

  private async attachExactPaymentFields(items: Record<string, unknown>[]) {
    const payerNames = Array.from(
      new Set(
        items
          .map((item) =>
            pickFirstString(item, ['payerName', 'applyUserName', 'applyUser', 'creatorName']),
          )
          .filter(Boolean),
      ),
    );

    if (payerNames.length === 0) {
      return items;
    }

    const [paymentMethods, payers]: [PaymentMethod[], ExpensePayer[]] = await Promise.all([
      this.prisma.paymentMethod.findMany({
        where: {
          payerName: {
            in: payerNames,
          },
        },
      }),
      this.prisma.expensePayer.findMany({
        where: {
          payerName: {
            in: payerNames,
          },
        },
      }),
    ]);

    const methodMap = new Map<string, PaymentMethod>();
    for (const item of paymentMethods) {
      methodMap.set(item.payerName || '', item);
    }
    const payerMap = new Map<string, ExpensePayer>();
    for (const item of payers) {
      payerMap.set(item.payerName || '', item);
    }

    return items.map((item) => {
      const payerName = pickFirstString(item, [
        'payerName',
        'applyUserName',
        'applyUser',
        'creatorName',
      ]);
      const paymentMethod = methodMap.get(payerName);
      const payer = payerMap.get(payerName);
      if (!paymentMethod && !payer) {
        return item;
      }

      return {
        ...item,
        applicant: paymentMethod?.payerName || payer?.payerName || item.applicant,
        payerAccount: paymentMethod?.payerAccount || payer?.bankAccount || '',
        payerBank: paymentMethod?.payerBank || payer?.bankName || '',
        payerUnit: paymentMethod?.payerUnit || payer?.relatedUnit || '',
        paymentType: paymentMethod?.paymentType || item.paymentType || '',
        relationType: paymentMethod?.relationType || item.relationType || '',
      };
    });
  }

  private async attachExactPaymentDetailFields(items: Record<string, unknown>[]) {
    const payerNames = Array.from(
      new Set(
        items
          .map((item) => pickFirstString(item, ['payerName', 'paymentUser', 'applyUserName']))
          .filter(Boolean),
      ),
    );
    const payeeNames = Array.from(
      new Set(
        items
          .map((item) => pickFirstString(item, ['payeeName', 'receiveUser', 'receiverName']))
          .filter(Boolean),
      ),
    );

    const paymentMethods: PaymentMethod[] =
      payerNames.length > 0
        ? await this.prisma.paymentMethod.findMany({
            where: {
              payerName: {
                in: payerNames,
              },
            },
          })
        : [];
    const payers: ExpensePayer[] =
      payerNames.length > 0
        ? await this.prisma.expensePayer.findMany({
            where: {
              payerName: {
                in: payerNames,
              },
            },
          })
        : [];
    const payees: ExpensePayee[] =
      payeeNames.length > 0
        ? await this.prisma.expensePayee.findMany({
            where: {
              payeeName: {
                in: payeeNames,
              },
            },
          })
        : [];

    const methodMap = new Map<string, PaymentMethod>();
    for (const item of paymentMethods) {
      methodMap.set(item.payerName || '', item);
    }
    const payerMap = new Map<string, ExpensePayer>();
    for (const item of payers) {
      payerMap.set(item.payerName || '', item);
    }
    const payeeMap = new Map<string, ExpensePayee>();
    for (const item of payees) {
      payeeMap.set(item.payeeName || '', item);
    }

    return items.map((item) => {
      const payerName = pickFirstString(item, ['payerName', 'paymentUser', 'applyUserName']);
      const payeeName = pickFirstString(item, ['payeeName', 'receiveUser', 'receiverName']);
      const paymentMethod = methodMap.get(payerName);
      const payer = payerMap.get(payerName);
      const payee = payeeMap.get(payeeName);

      if (!paymentMethod && !payer && !payee) {
        return item;
      }

      return {
        ...item,
        payerAccount:
          paymentMethod?.payerAccount ||
          payer?.bankAccount ||
          pickFirstString(item, ['payerAccount']),
        payerBank:
          paymentMethod?.payerBank || payer?.bankName || pickFirstString(item, ['payerBank']),
        payerName: payerName || paymentMethod?.payerName || payer?.payerName || '',
        payerUnit:
          paymentMethod?.payerUnit || payer?.relatedUnit || pickFirstString(item, ['payerUnit']),
        payeeAccount: payee?.bankAccount || pickFirstString(item, ['payeeAccount']),
        payeeBank: payee?.bankName || pickFirstString(item, ['payeeBank']),
        payeeBudgetUnit: payee?.budgetUnit || pickFirstString(item, ['payeeBudgetUnit']),
        payeeName: payeeName || payee?.payeeName || '',
        payeeType: payee?.accountType || pickFirstString(item, ['payeeType']),
        paymentType: paymentMethod?.paymentType || pickFirstString(item, ['paymentType']),
        relationType: paymentMethod?.relationType || pickFirstString(item, ['relationType']),
      };
    });
  }

  private serializeListItem(
    item: Record<string, unknown>,
    page: number,
    pageSize: number,
    index: number,
  ) {
    const rowId = `${page}-${pageSize}-${index + 1}`;
    return {
      amount: pickFirstNumber(item, ['amount', 'totalAmount', 'payAmount', 'money']),
      applicant: pickFirstString(item, ['payerName', 'applyUserName', 'applyUser', 'creatorName']),
      billNo: pickFirstString(item, ['billNo', 'bill_no', 'flowNo', 'docNo']),
      billTime: pickFirstString(item, ['billTime', 'billDate', 'applyTime', 'createTime']),
      id: pickFirstString(item, ['id', 'billId', 'applyId', 'flowId']) || rowId,
      payerAccount: pickFirstString(item, ['payerAccount']),
      payerBank: pickFirstString(item, ['payerBank']),
      payerUnit: pickFirstString(item, ['payerUnit']),
      paymentType: pickFirstString(item, ['paymentType']),
      raw: item,
      relationType: pickFirstString(item, ['relationType']),
      status: pickFirstString(item, ['status', 'billStatus', 'flowStatus']),
      title: pickFirstString(item, [
        'title',
        'billTitle',
        'subject',
        'summary',
        'remark',
        'applyTitle',
      ]),
    };
  }
}
