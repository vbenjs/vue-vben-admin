import { financePaymentApi, financeReimbursementApi } from '#/api/core/finance';

export interface LegacyFinanceListItem {
  amount: null | number;
  applicant: string;
  billNo: string;
  billTime: string;
  claimType?: string;
  flowNode?: string;
  id: string;
  payerAccount?: string;
  payerBank?: string;
  payerUnit?: string;
  payableAmount?: null | number;
  paymentType?: string;
  raw: Record<string, unknown>;
  relationType?: string;
  status: string;
  title: string;
}

function pickFirstValue(item: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = item[key];
    if (value === undefined || value === null) {
      continue;
    }
    const normalized = `${value}`.trim();
    if (normalized) {
      return normalized;
    }
  }
  return '';
}

function normalizeAmount(
  item: Record<string, unknown>,
  keys = [
    'amount',
    'totalAmount',
    'payAmount',
    'applyAmount',
    'money',
    'total_fee',
  ],
) {
  const rawValue = pickFirstValue(item, keys);

  if (!rawValue) {
    return null;
  }

  const parsed = Number.parseFloat(rawValue.replaceAll(',', ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeFinanceItem(
  item: Record<string, unknown>,
  index: number,
  page: number,
  pageSize: number,
): LegacyFinanceListItem {
  const rowId = `${page}-${pageSize}-${index + 1}`;
  return {
    amount: normalizeAmount(item),
    applicant: pickFirstValue(item, [
      'applyUser',
      'applyUserName',
      'payerName',
      'creatorName',
      'createBy',
      'applicant',
    ]),
    billNo: pickFirstValue(item, [
      'billNo',
      'bill_no',
      'flowNo',
      'voucherNo',
      'docNo',
    ]),
    billTime: pickFirstValue(item, [
      'billTime',
      'billDate',
      'applyTime',
      'createTime',
      'createdAt',
    ]),
    claimType: pickFirstValue(item, ['claimType']),
    flowNode: pickFirstValue(item, ['flowNode', 'currentNode']),
    id:
      pickFirstValue(item, [
        'id',
        'billId',
        'applyId',
        'flowId',
        'voucherId',
      ]) || rowId,
    payerAccount: pickFirstValue(item, ['payerAccount']),
    payerBank: pickFirstValue(item, ['payerBank']),
    payerUnit: pickFirstValue(item, ['payerUnit']),
    payableAmount: normalizeAmount(item, ['payableAmount']),
    paymentType: pickFirstValue(item, ['paymentType']),
    raw: item,
    relationType: pickFirstValue(item, ['relationType']),
    status: pickFirstValue(item, [
      'status',
      'billStatus',
      'flowStatus',
      'voucherStatus',
    ]),
    title: pickFirstValue(item, [
      'title',
      'billTitle',
      'subject',
      'summary',
      'remark',
      'applyTitle',
    ]),
  };
}

export async function fetchLegacyFinanceList(params: {
  billNo?: string;
  keyword?: string;
  page: number;
  pageSize: number;
  queryKey: 'payment-list' | 'reimbursement-list';
  status?: string;
}) {
  const response =
    params.queryKey === 'payment-list'
      ? await financePaymentApi.getList({
          billNo: params.billNo,
          keyword: params.keyword,
          page: params.page,
          pageSize: params.pageSize,
          status: params.status,
        })
      : await financeReimbursementApi.getList({
          billNo: params.billNo,
          keyword: params.keyword,
          page: params.page,
          pageSize: params.pageSize,
          status: params.status,
        });
  const items = Array.isArray(response?.items)
    ? response.items.map((item: Record<string, unknown>, index: number) =>
        normalizeFinanceItem(item, index, params.page, params.pageSize),
      )
    : [];

  return {
    items,
    total: Number(response?.total || 0),
  };
}
