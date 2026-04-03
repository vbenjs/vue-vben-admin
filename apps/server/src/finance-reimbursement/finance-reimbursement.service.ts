import type { AppRequestContext } from '../common/request-context/request-context.types';

import { BadRequestException, Injectable } from '@nestjs/common';

import { pickFirstNumber, pickFirstString } from '../finance-common/finance-legacy-record.util';
import { LegacySqlService } from '../legacy-sql/legacy-sql.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceReimbursementService {
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
      return this.findAllFromLocal(params, requestContext);
    }

    const result = await this.legacySqlService.executeNamedQuery('reimbursement-list', {
      billNo: params.billNo,
      fiscalYear: requestContext.fiscalYear,
      keyword: params.keyword,
      page: params.page,
      pageSize: params.pageSize,
      status: params.status,
      tenantId: requestContext.tenantId,
    });
    const enrichedItems = await this.attachExactExpenseClaimFields(result.items);

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

    const localClaim = await this.prisma.expenseClaim.findFirst({
      where: { claimNo: normalizedBillNo },
    });
    if (localClaim) {
      const detailItems = await this.prisma.expenseClaimDetail.findMany({
        orderBy: { id: 'asc' },
        where: { claimId: localClaim.id },
      });

      return {
        billNo: normalizedBillNo,
        items: detailItems.map((item) => ({
          ...item,
          claimId: item.claimId?.toString(),
          id: item.id.toString(),
          indicatorId: item.indicatorId?.toString(),
          realIndicatorId: item.realIndicatorId?.toString(),
        })),
        total: detailItems.length,
      };
    }

    if (!this.shouldUseLegacySource()) {
      return {
        billNo: normalizedBillNo,
        items: [],
        total: 0,
      };
    }

    const result = await this.legacySqlService.executeNamedQuery('reimbursement-detail', {
      billNo: normalizedBillNo,
      page: 1,
      pageSize: 100,
      tenantId: requestContext.tenantId,
    });

    return {
      billNo: normalizedBillNo,
      items: result.items,
      total: result.total,
    };
  }

  private async findAllFromLocal(
    params: {
      billNo?: string;
      keyword?: string;
      page?: number;
      pageSize?: number;
      status?: string;
    },
    requestContext: AppRequestContext,
  ) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const normalizedBillNo = `${params.billNo || ''}`.trim().toLowerCase();
    const normalizedKeyword = `${params.keyword || ''}`.trim().toLowerCase();
    const normalizedStatus = `${params.status || ''}`.trim();

    const claims = await this.prisma.expenseClaim.findMany({
      orderBy: [{ createTime: 'desc' }, { id: 'desc' }],
    });

    const filteredClaims = claims.filter((claim) => {
      const claimNo = `${claim.claimNo || ''}`.trim().toLowerCase();
      const applicant = `${claim.applicant || ''}`.trim().toLowerCase();
      const claimType = `${claim.claimType || ''}`.trim().toLowerCase();
      const fundUsage = `${claim.fundUsage || ''}`.trim().toLowerCase();
      const status = `${claim.flowStatus || claim.status || ''}`.trim();

      if (normalizedBillNo && !claimNo.includes(normalizedBillNo)) {
        return false;
      }

      if (
        normalizedKeyword &&
        !applicant.includes(normalizedKeyword) &&
        !claimType.includes(normalizedKeyword) &&
        !fundUsage.includes(normalizedKeyword) &&
        !claimNo.includes(normalizedKeyword)
      ) {
        return false;
      }

      if (normalizedStatus && status !== normalizedStatus) {
        return false;
      }

      return true;
    });

    const pagedClaims = filteredClaims.slice((page - 1) * pageSize, page * pageSize);

    return {
      context: {
        fiscalYear: requestContext.fiscalYear || '',
        tenantId: requestContext.tenantId,
        tenantName: requestContext.tenantName || '',
      },
      items: pagedClaims.map((claim, index) =>
        this.serializeListItem(
          {
            applicant: claim.applicant,
            billNo: claim.claimNo,
            billTime: claim.claimDate || claim.fillDate || claim.createTime,
            claimAmount: claim.claimAmount,
            claimType: claim.claimType,
            flowNode: claim.flowNode,
            flowStatus: claim.flowStatus,
            id: claim.id.toString(),
            payableAmount: claim.payableAmount,
            title: claim.claimType || claim.fundUsage || claim.remark || '',
          },
          page,
          pageSize,
          index,
        ),
      ),
      total: filteredClaims.length,
    };
  }

  private shouldUseLegacySource() {
    if (typeof this.legacySqlService.getStatus !== 'function') {
      return true;
    }

    const status = this.legacySqlService.getStatus();
    return Boolean(status.enabled && status.configured);
  }

  private async attachExactExpenseClaimFields(items: Record<string, unknown>[]) {
    const claimNos = Array.from(
      new Set(
        items
          .map((item) => pickFirstString(item, ['billNo', 'bill_no', 'flowNo', 'docNo']))
          .filter(Boolean),
      ),
    );

    if (claimNos.length === 0) {
      return items;
    }

    const claims = await this.prisma.expenseClaim.findMany({
      where: {
        claimNo: {
          in: claimNos,
        },
      },
    });
    const claimMap = new Map(claims.map((item) => [item.claimNo || '', item]));

    return items.map((item) => {
      const billNo = pickFirstString(item, ['billNo', 'bill_no', 'flowNo', 'docNo']);
      const claim = claimMap.get(billNo);
      if (!claim) {
        return item;
      }

      return {
        ...item,
        applicant: claim.applicant || item.applicant,
        billTime: claim.claimDate || claim.fillDate || claim.createTime,
        claimAmount: claim.claimAmount,
        claimType: claim.claimType,
        flowNode: claim.flowNode,
        flowStatus: claim.flowStatus,
        id: claim.id.toString(),
        payableAmount: claim.payableAmount,
        title:
          pickFirstString(item, [
            'title',
            'billTitle',
            'subject',
            'summary',
            'remark',
            'applyTitle',
          ]) ||
          claim.claimType ||
          claim.fundUsage ||
          '',
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
      amount: pickFirstNumber(item, [
        'claimAmount',
        'amount',
        'totalAmount',
        'applyAmount',
        'money',
      ]),
      applicant: pickFirstString(item, [
        'applicant',
        'applyUser',
        'applyUserName',
        'creatorName',
        'applicant',
      ]),
      billNo: pickFirstString(item, ['billNo', 'bill_no', 'flowNo', 'docNo']),
      billTime: pickFirstString(item, [
        'billTime',
        'billTime',
        'billDate',
        'applyTime',
        'createTime',
      ]),
      claimType: pickFirstString(item, ['claimType']),
      flowNode: pickFirstString(item, ['flowNode', 'currentNode']),
      id: pickFirstString(item, ['id', 'billId', 'applyId', 'flowId']) || rowId,
      payableAmount: pickFirstNumber(item, ['payableAmount']),
      raw: item,
      status: pickFirstString(item, ['flowStatus', 'status', 'billStatus', 'flowStatus']),
      title: pickFirstString(item, [
        'title',
        'claimType',
        'billTitle',
        'subject',
        'summary',
        'remark',
        'applyTitle',
      ]),
    };
  }
}
