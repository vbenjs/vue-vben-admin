import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Injectable } from '@nestjs/common';

import { pickFirstNumber, pickFirstString } from '../finance-common/finance-legacy-record.util';
import { LegacySqlService } from '../legacy-sql/legacy-sql.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceVoucherService {
  constructor(
    private readonly legacySqlService: LegacySqlService,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(
    params: {
      indicatorCode?: string;
      keyword?: string;
      page?: number;
      pageSize?: number;
    },
    requestContext: AppRequestContext = {},
  ) {
    if (!this.shouldUseLegacySource()) {
      return this.findAllFromLocal(params, requestContext);
    }

    const result = await this.legacySqlService.executeNamedQuery('account-balance-list', {
      fiscalYear: requestContext.fiscalYear,
      indicatorCode: params.indicatorCode,
      keyword: params.keyword,
      page: params.page,
      pageSize: params.pageSize,
      tenantId: requestContext.tenantId,
    });
    const enrichedItems = await this.attachExactBudgetIndicatorFields(result.items);

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

  private async findAllFromLocal(
    params: {
      indicatorCode?: string;
      keyword?: string;
      page?: number;
      pageSize?: number;
    },
    requestContext: AppRequestContext,
  ) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const normalizedIndicatorCode = `${params.indicatorCode || ''}`.trim().toLowerCase();
    const normalizedKeyword = `${params.keyword || ''}`.trim().toLowerCase();

    const indicators = await this.prisma.budgetIndicator.findMany({
      orderBy: [{ updateTime: 'desc' }, { id: 'desc' }],
    });

    const filteredIndicators = indicators.filter((indicator) => {
      const indicatorCode = `${indicator.indicatorCode || ''}`.trim().toLowerCase();
      const indicatorName = `${indicator.indicatorName || ''}`.trim().toLowerCase();
      const voucherNo = `${indicator.voucherNo || ''}`.trim().toLowerCase();

      if (normalizedIndicatorCode && !indicatorCode.includes(normalizedIndicatorCode)) {
        return false;
      }

      if (
        normalizedKeyword &&
        !indicatorName.includes(normalizedKeyword) &&
        !voucherNo.includes(normalizedKeyword) &&
        !indicatorCode.includes(normalizedKeyword)
      ) {
        return false;
      }

      return true;
    });

    const pagedIndicators = filteredIndicators.slice((page - 1) * pageSize, page * pageSize);

    return {
      context: {
        fiscalYear: requestContext.fiscalYear || '',
        tenantId: requestContext.tenantId,
        tenantName: requestContext.tenantName || '',
      },
      items: pagedIndicators.map((indicator, index) =>
        this.serializeListItem(
          {
            availableAmount: indicator.availableAmount,
            id: indicator.id.toString(),
            indicatorCode: indicator.indicatorCode,
            indicatorName: indicator.indicatorName,
            paymentAmount: indicator.paidAmount,
            voucherMonth: indicator.voucherMonth,
            voucherNo: indicator.voucherNo,
            voucherStatus: indicator.voucherStatus,
            yearBeginAmount: indicator.yearBeginAmount,
            yearTotalAmount: indicator.yearTotalAmount,
          },
          page,
          pageSize,
          index,
        ),
      ),
      total: filteredIndicators.length,
    };
  }

  private shouldUseLegacySource() {
    if (typeof this.legacySqlService.getStatus !== 'function') {
      return true;
    }

    const status = this.legacySqlService.getStatus();
    return Boolean(status.enabled && status.configured);
  }

  private async attachExactBudgetIndicatorFields(items: Record<string, unknown>[]) {
    const indicatorCodes = Array.from(
      new Set(
        items
          .map((item) =>
            pickFirstString(item, ['indicatorCode', 'indicator_code', 'zbCode', 'quotaCode']),
          )
          .filter(Boolean),
      ),
    );

    if (indicatorCodes.length === 0) {
      return items;
    }

    const indicators = await this.prisma.budgetIndicator.findMany({
      where: {
        indicatorCode: {
          in: indicatorCodes,
        },
      },
    });
    const indicatorMap = new Map(indicators.map((item) => [item.indicatorCode || '', item]));

    return items.map((item) => {
      const indicatorCode = pickFirstString(item, [
        'indicatorCode',
        'indicator_code',
        'zbCode',
        'quotaCode',
      ]);
      const indicator = indicatorMap.get(indicatorCode);
      if (!indicator) {
        return item;
      }

      return {
        ...item,
        availableAmount: indicator.availableAmount,
        id: indicator.id.toString(),
        indicatorCode: indicator.indicatorCode,
        indicatorName: indicator.indicatorName,
        paymentAmount: indicator.paidAmount,
        voucherMonth: indicator.voucherMonth,
        voucherNo: indicator.voucherNo,
        voucherStatus: indicator.voucherStatus,
        yearBeginAmount: indicator.yearBeginAmount,
        yearTotalAmount: indicator.yearTotalAmount,
      };
    });
  }

  private serializeListItem(
    item: Record<string, unknown>,
    page: number,
    pageSize: number,
    index: number,
  ) {
    return {
      availableAmount: pickFirstNumber(item, [
        'availableAmount',
        'availableAmount',
        'kyAmt',
        'usableAmount',
      ]),
      id:
        pickFirstString(item, ['id', 'indicatorCode', 'zbCode']) ||
        `${page}-${pageSize}-${index + 1}`,
      indicatorCode: pickFirstString(item, [
        'indicatorCode',
        'indicator_code',
        'zbCode',
        'quotaCode',
      ]),
      indicatorName: pickFirstString(item, [
        'indicatorName',
        'indicator_name',
        'zbName',
        'quotaName',
      ]),
      paymentAmount: pickFirstNumber(item, [
        'paymentAmount',
        'paymentAmount',
        'payAmt',
        'paidAmount',
      ]),
      voucherMonth: pickFirstString(item, ['voucherMonth', 'voucher_month']),
      voucherNo: pickFirstString(item, ['voucherNo', 'voucher_no']),
      voucherStatus: pickFirstString(item, ['voucherStatus', 'voucher_status', 'status']),
      yearBeginAmount: pickFirstNumber(item, ['yearBeginAmount']),
      yearTotalAmount: pickFirstNumber(item, ['yearTotalAmount']),
    };
  }
}
