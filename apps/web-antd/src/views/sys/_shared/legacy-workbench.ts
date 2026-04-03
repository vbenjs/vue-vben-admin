import { financeWorkflowApi } from '#/api/core/finance';

export interface LegacyWorkbenchListItem {
  applyId: string;
  applyTime: string;
  applyTitle: string;
  applyUser: string;
  businessCategory: string;
  currentHandler: string;
  currentNode: string;
  flowId: string;
  flowNo: string;
  raw: Record<string, unknown>;
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

function normalizeWorkbenchItem(
  item: Record<string, unknown>,
  index: number,
  page: number,
  pageSize: number,
): LegacyWorkbenchListItem {
  const rowId = `${page}-${pageSize}-${index + 1}`;
  const flowId = pickFirstValue(item, [
    'flowId',
    'processId',
    'instanceId',
    'id',
  ]);
  const applyId = pickFirstValue(item, ['applyId', 'billId', 'formId', 'id']);
  const title = pickFirstValue(item, [
    'title',
    'applyTitle',
    'flowTitle',
    'billTitle',
    'billName',
    'subject',
  ]);

  return {
    applyId: applyId || flowId || rowId,
    applyTime: pickFirstValue(item, [
      'applyTime',
      'submitTime',
      'createTime',
      'applyDate',
      'createdAt',
    ]),
    applyTitle: title,
    applyUser: pickFirstValue(item, [
      'applyUser',
      'applyUserName',
      'creatorName',
      'createBy',
      'submitter',
      'applicant',
    ]),
    businessCategory: pickFirstValue(item, ['businessCategory']),
    currentHandler: pickFirstValue(item, [
      'currentHandler',
      'handlerName',
      'assigneeName',
      'auditUser',
      'approver',
    ]),
    currentNode: pickFirstValue(item, [
      'currentNode',
      'currentNodeName',
      'nodeName',
      'taskName',
      'stepName',
    ]),
    flowId: flowId || applyId || rowId,
    flowNo: pickFirstValue(item, [
      'flowNo',
      'flow_no',
      'billNo',
      'bill_no',
      'processNo',
      'instanceNo',
    ]),
    raw: item,
    status: pickFirstValue(item, [
      'status',
      'flowStatus',
      'flow_status',
      'approveStatus',
    ]),
    title,
  };
}

export async function fetchLegacyWorkbenchList(params: {
  businessCategory?: string;
  flowNo?: string;
  keyword?: string;
  page: number;
  pageSize: number;
  queryType: string;
  status?: string;
  userId?: number | string;
}) {
  const response = await financeWorkflowApi.getWorkbenchList(params);
  const items = Array.isArray(response?.items)
    ? response.items.map((item: Record<string, unknown>, index: number) =>
        normalizeWorkbenchItem(item, index, params.page, params.pageSize),
      )
    : [];

  return {
    items,
    total: Number(response?.total || 0),
  };
}
