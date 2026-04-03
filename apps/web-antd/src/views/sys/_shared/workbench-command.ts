import { financeWorkflowApi } from '#/api/core/finance';

export type WorkflowCommandAction =
  | 'add-sign'
  | 'approve'
  | 'reject'
  | 'remind'
  | 'withdraw';

export function buildWorkflowCommandPayload(
  record: Record<string, unknown>,
  opinion = '',
) {
  const raw =
    record.raw && typeof record.raw === 'object'
      ? (record.raw as Record<string, unknown>)
      : {};

  return {
    businessId:
      raw.businessId ||
      raw.billId ||
      raw.applyId ||
      raw.formId ||
      record.applyId,
    businessNo:
      raw.businessNo ||
      raw.billNo ||
      raw.flowNo ||
      record.flowNo ||
      record.applyId,
    businessType:
      raw.businessType ||
      raw.business_type ||
      record.businessType ||
      'legacy-workflow',
    currentNode:
      raw.currentNode ||
      raw.currentNodeName ||
      raw.nodeName ||
      record.currentNode,
    flowNo: raw.flowNo || raw.billNo || record.flowNo,
    nodeCode: raw.nodeCode || raw.node_code || '',
    opinion,
    title:
      raw.title ||
      raw.applyTitle ||
      raw.flowTitle ||
      raw.billTitle ||
      record.title,
  };
}

export async function fetchWorkflowHistory(record: Record<string, unknown>) {
  return financeWorkflowApi.getHistory({
    businessNo: record.flowNo || record.applyId,
  });
}

export async function runWorkflowCommand(
  action: WorkflowCommandAction,
  record: Record<string, unknown>,
  opinion = '',
) {
  return financeWorkflowApi.runCommand(
    action,
    buildWorkflowCommandPayload(record, opinion),
  );
}
