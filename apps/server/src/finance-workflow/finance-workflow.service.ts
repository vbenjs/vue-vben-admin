import type { AppRequestContext } from '../common/request-context/request-context.types';

import { BadRequestException, Injectable } from '@nestjs/common';

import { pickFirstString } from '../finance-common/finance-legacy-record.util';
import { LegacySqlService } from '../legacy-sql/legacy-sql.service';
import { PrismaService } from '../prisma/prisma.service';

type WorkflowCommandAction = 'add-sign' | 'approve' | 'reject' | 'remind' | 'submit' | 'withdraw';

type WorkflowActor = {
  realName?: string;
  userId?: string;
  username?: string;
};

type WorkflowCommandPayload = {
  businessId?: number | string;
  businessNo?: string;
  businessType?: string;
  currentNode?: string;
  flowNo?: string;
  nodeCode?: string;
  opinion?: string;
  title?: string;
};

type WorkflowBusinessTarget = {
  aliases: string[];
  matchByIdOnly?: boolean;
  model: string;
  noFields: string[];
  nodeField?: string;
};

type LocalWorkbenchSource = {
  applicantFields: string[];
  businessTypes: string[];
  matchByIdOnly?: boolean;
  model: string;
  nodeField?: string;
  noFields: string[];
  timeFields: string[];
  titleFields: string[];
};

const WORKFLOW_BUSINESS_TARGETS: WorkflowBusinessTarget[] = [
  {
    aliases: ['research-project', 'research_project'],
    model: 'researchProject',
    noFields: ['projectCode'],
  },
  {
    aliases: ['research-indicator', 'research_indicator'],
    model: 'researchIndicator',
    noFields: ['indicatorCode'],
  },
  {
    aliases: ['research-scope-adjust', 'research_scope_adjust'],
    matchByIdOnly: true,
    model: 'researchScopeAdjust',
    noFields: [],
  },
  {
    aliases: ['bid-notice', 'bid_notice'],
    matchByIdOnly: true,
    model: 'bidNotice',
    noFields: [],
  },
  {
    aliases: ['expense-claim', 'expense_claim', 'claim', 'reimbursement'],
    model: 'expenseClaim',
    noFields: ['claimNo'],
    nodeField: 'flowNode',
  },
  {
    aliases: ['auth-adjust-apply', 'auth_adjust_apply'],
    model: 'authAdjustApply',
    noFields: ['applyNo'],
  },
  {
    aliases: ['procurement-apply', 'procurement_apply'],
    model: 'procurementApply',
    noFields: ['applyNo'],
    nodeField: 'bizNode',
  },
  {
    aliases: ['procurement-result', 'procurement_result'],
    model: 'procurementResult',
    noFields: ['applyNo'],
  },
  {
    aliases: ['contract'],
    model: 'contract',
    noFields: ['contractNo', 'contractApplyNo'],
    nodeField: 'bizNode',
  },
  {
    aliases: ['contract-receipt', 'contract_receipt'],
    model: 'contractReceipt',
    noFields: ['receiptNo', 'contractNo'],
    nodeField: 'flowNode',
  },
];

const LOCAL_WORKFLOW_NODE_SEQUENCES: Partial<Record<string, string[]>> = {
  contract: ['申请节点', '部门审核', '合同审核', '流程结束'],
  contractReceipt: ['申请节点', '部门审核', '财务审核', '流程结束'],
  expenseClaim: ['申请节点', '部门审批', '财务审核', '流程结束'],
  procurementApply: ['申请节点', '采购审核', '流程结束'],
};

const LOCAL_WORKBENCH_SOURCES: LocalWorkbenchSource[] = [
  {
    applicantFields: ['applicant', 'fillerName', 'createBy'],
    businessTypes: ['expense-claim'],
    model: 'expenseClaim',
    nodeField: 'flowNode',
    noFields: ['claimNo'],
    timeFields: ['claimDate', 'createTime'],
    titleFields: ['claimType', 'fundUsage'],
  },
  {
    applicantFields: ['operatorName', 'createBy'],
    businessTypes: ['contract-receipt'],
    model: 'contractReceipt',
    nodeField: 'flowNode',
    noFields: ['receiptNo', 'contractNo'],
    timeFields: ['receiptDate', 'createTime'],
    titleFields: ['contractName', 'receiptNo'],
  },
  {
    applicantFields: ['createBy'],
    businessTypes: ['contract'],
    model: 'contract',
    nodeField: 'bizNode',
    noFields: ['contractNo', 'contractApplyNo'],
    timeFields: ['signDate', 'createTime'],
    titleFields: ['contractName', 'projectName'],
  },
  {
    applicantFields: ['projectManager', 'createBy'],
    businessTypes: ['research-project'],
    model: 'researchProject',
    noFields: ['projectCode'],
    timeFields: ['createTime'],
    titleFields: ['projectName'],
  },
  {
    applicantFields: ['deptName', 'createBy'],
    businessTypes: ['research-indicator'],
    model: 'researchIndicator',
    noFields: ['indicatorCode'],
    timeFields: ['createTime'],
    titleFields: ['indicatorName', 'projectName'],
  },
  {
    applicantFields: ['createBy'],
    businessTypes: ['research-scope-adjust'],
    matchByIdOnly: true,
    model: 'researchScopeAdjust',
    noFields: [],
    timeFields: ['createTime'],
    titleFields: ['indicatorName', 'outScopeName'],
  },
  {
    applicantFields: ['operatorName', 'createBy'],
    businessTypes: ['procurement-apply'],
    model: 'procurementApply',
    nodeField: 'bizNode',
    noFields: ['applyNo'],
    timeFields: ['applyDate', 'createTime'],
    titleFields: ['projectName'],
  },
  {
    applicantFields: ['createBy'],
    businessTypes: ['procurement-result'],
    model: 'procurementResult',
    noFields: ['applyNo'],
    timeFields: ['createTime'],
    titleFields: ['projectName', 'winBidSupplier'],
  },
  {
    applicantFields: ['createBy'],
    businessTypes: ['bid-notice'],
    matchByIdOnly: true,
    model: 'bidNotice',
    noFields: [],
    timeFields: ['publishDate', 'createTime'],
    titleFields: ['noticeTitle', 'projectName'],
  },
];

@Injectable()
export class FinanceWorkflowService {
  constructor(
    private readonly legacySqlService: LegacySqlService,
    private readonly prisma: PrismaService,
  ) {}

  async getWorkbenchList(
    params: {
      businessCategory?: string;
      flowNo?: string;
      keyword?: string;
      page?: number;
      pageSize?: number;
      queryType?: string;
      status?: string;
      userId?: string;
    },
    requestContext: AppRequestContext = {},
  ) {
    const legacyStatus = this.legacySqlService.getStatus();
    let items: Record<string, unknown>[] = [];
    let total = 0;

    if (legacyStatus.enabled && legacyStatus.configured) {
      try {
        const result = await this.legacySqlService.executeNamedQuery('todo-list', {
          fiscalYear: requestContext.fiscalYear,
          flowNo: params.flowNo,
          keyword: params.keyword,
          page: params.page,
          pageSize: params.pageSize,
          queryType: params.queryType,
          status: params.status,
          tenantId: requestContext.tenantId,
          userId: params.userId,
        });

        items = result.items.map((item, index) =>
          this.serializeListItem(item, params.page || 1, params.pageSize || 30, index),
        );
        total = result.total;
      } catch {
        const localResult = await this.getLocalWorkbenchList(params);
        items = localResult.items;
        total = localResult.total;
      }
    } else {
      const localResult = await this.getLocalWorkbenchList(params);
      items = localResult.items;
      total = localResult.total;
    }

    return {
      context: {
        fiscalYear: requestContext.fiscalYear || '',
        tenantId: requestContext.tenantId,
        tenantName: requestContext.tenantName || '',
      },
      items: await this.attachLatestApprovalState(items),
      total,
    };
  }

  async executeCommand(
    action: WorkflowCommandAction,
    payload: WorkflowCommandPayload,
    actor: WorkflowActor,
  ) {
    const businessNo = this.normalizeBusinessNo(payload);
    if (!businessNo) {
      throw new BadRequestException('业务编号不能为空');
    }

    const actorProfile = await this.resolveActorProfile(actor);
    const approvalTime = new Date();
    const record = await this.prisma.approvalRecord.create({
      data: {
        approvalAction: action,
        approvalOpinion: `${payload.opinion || ''}`.trim(),
        approvalTime,
        approverDeptId: actorProfile.deptId,
        approverDeptName: actorProfile.deptName,
        approverName: actorProfile.realName,
        approverUserId: actorProfile.userId,
        businessId: this.normalizeBigInt(payload.businessId),
        businessNo,
        businessType: `${payload.businessType || 'legacy-workflow'}`.trim(),
        createBy: actorProfile.username,
        nodeCode: `${payload.nodeCode || ''}`.trim(),
        nodeName: `${payload.currentNode || ''}`.trim(),
        remark: `${payload.title || payload.flowNo || ''}`.trim(),
      },
    });

    await this.applyWorkflowStatusToBusiness(action, payload, actorProfile.username || 'system');

    return this.serializeApprovalRecord(record);
  }

  async getHistory(params: { businessNo?: string; flowNo?: string }) {
    const businessNo = `${params.businessNo || params.flowNo || ''}`.trim();
    if (!businessNo) {
      return [];
    }

    const records = await this.prisma.approvalRecord.findMany({
      orderBy: [{ approvalTime: 'desc' }, { createTime: 'desc' }],
      where: { businessNo },
    });

    return records.map((item) => this.serializeApprovalRecord(item));
  }

  private async attachLatestApprovalState(items: Record<string, unknown>[]) {
    const businessNos = Array.from(
      new Set(items.map((item) => pickFirstString(item, ['flowNo', 'applyId'])).filter(Boolean)),
    );

    if (businessNos.length === 0) {
      return items;
    }

    const records = await this.prisma.approvalRecord.findMany({
      orderBy: [{ approvalTime: 'desc' }, { createTime: 'desc' }],
      where: {
        businessNo: {
          in: businessNos,
        },
      },
    });

    const latestMap = new Map<string, (typeof records)[number]>();
    for (const record of records) {
      const businessNo = `${record.businessNo || ''}`.trim();
      if (businessNo && !latestMap.has(businessNo)) {
        latestMap.set(businessNo, record);
      }
    }

    return items.map((item) => {
      const businessNo = pickFirstString(item, ['flowNo', 'applyId']);
      const latestRecord = businessNo ? latestMap.get(businessNo) : undefined;
      if (!latestRecord) {
        return item;
      }

      return {
        ...item,
        latestAction: latestRecord.approvalAction || '',
        latestApprovalTime: latestRecord.approvalTime,
        latestOpinion: latestRecord.approvalOpinion || '',
        status: this.mapActionToWorkbenchStatus(
          latestRecord.approvalAction,
          pickFirstString(item, ['status']),
        ),
      };
    });
  }

  private async getLocalWorkbenchList(params: {
    businessCategory?: string;
    flowNo?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
    queryType?: string;
    status?: string;
    userId?: string;
  }) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 30;
    const normalizedBusinessCategory = `${params.businessCategory || ''}`
      .trim()
      .toLowerCase();
    const normalizedQueryType = `${params.queryType || ''}`.trim().toLowerCase();
    const normalizedFlowNo = `${params.flowNo || ''}`.trim().toLowerCase();
    const normalizedKeyword = `${params.keyword || ''}`.trim().toLowerCase();
    const normalizedStatus = `${params.status || ''}`.trim();
    const normalizedUserId = `${params.userId || ''}`.trim();
    const sourceBusinessTypes = LOCAL_WORKBENCH_SOURCES.flatMap((item) => item.businessTypes);

    const records = await this.prisma.approvalRecord.findMany({
      orderBy: [{ approvalTime: 'desc' }, { createTime: 'desc' }],
      where: {
        businessType: {
          in: sourceBusinessTypes,
        },
      },
    });

    const groupedRecords = new Map<
      string,
      {
        businessId?: string;
        businessNo: string;
        businessType: string;
        latestRecord: any;
        records: any[];
        submitRecord?: any;
      }
    >();

    for (const record of records) {
      const businessNo = `${record.businessNo || ''}`.trim();
      if (!businessNo) {
        continue;
      }

      const existing = groupedRecords.get(businessNo);
      if (existing) {
        existing.records.push(record);
        if (!existing.submitRecord && record.approvalAction === 'submit') {
          existing.submitRecord = record;
        }
        continue;
      }

      groupedRecords.set(businessNo, {
        businessId: record.businessId?.toString(),
        businessNo,
        businessType: `${record.businessType || ''}`.trim().toLowerCase(),
        latestRecord: record,
        records: [record],
        submitRecord: record.approvalAction === 'submit' ? record : undefined,
      });
    }

    const businessGroups = Array.from(groupedRecords.values());
    const sourceRows = await this.loadLocalWorkbenchSourceRows(businessGroups);
    const localItems: Record<string, unknown>[] = [];
    for (const group of businessGroups) {
      const item = this.buildLocalWorkbenchItem(group, sourceRows);
      if (!item) {
        continue;
      }
      if (!this.matchesLocalWorkbenchQueryType(item, normalizedQueryType, normalizedUserId)) {
        continue;
      }
      if (
        normalizedBusinessCategory &&
        pickFirstString(item, ['businessCategory']).toLowerCase() !== normalizedBusinessCategory
      ) {
        continue;
      }

      const flowNo = pickFirstString(item, ['flowNo']).toLowerCase();
      const title = pickFirstString(item, ['title']).toLowerCase();
      const applyUser = pickFirstString(item, ['applyUser']).toLowerCase();
      const status = pickFirstString(item, ['status']);

      if (normalizedFlowNo && !flowNo.includes(normalizedFlowNo)) {
        continue;
      }
      if (
        normalizedKeyword &&
        !title.includes(normalizedKeyword) &&
        !applyUser.includes(normalizedKeyword)
      ) {
        continue;
      }
      if (normalizedStatus && status !== normalizedStatus) {
        continue;
      }

      localItems.push(item);
    }

    localItems.sort((a, b) => {
      const bTime = new Date(pickFirstString(b, ['applyTime'])).getTime() || 0;
      const aTime = new Date(pickFirstString(a, ['applyTime'])).getTime() || 0;
      return bTime - aTime;
    });

    const startIndex = (page - 1) * pageSize;

    return {
      items: localItems.slice(startIndex, startIndex + pageSize),
      total: localItems.length,
    };
  }

  private async applyWorkflowStatusToBusiness(
    action: WorkflowCommandAction,
    payload: WorkflowCommandPayload,
    username: string,
  ) {
    const businessNo = this.normalizeBusinessNo(payload);
    const businessId = this.normalizeBigInt(payload.businessId);
    const nextStatus = this.mapActionToBusinessFlowStatus(action, '');

    if ((!businessId && !businessNo) || !nextStatus) {
      return;
    }

    const target = await this.resolveBusinessTarget(payload.businessType, businessNo);
    if (!target) {
      return;
    }

    const data: Record<string, unknown> = {
      flowStatus: nextStatus,
      updateBy: username,
    };
    const nextNode = this.resolveNextNode(target.model, action, payload.currentNode);
    if (target.nodeField && nextNode) {
      data[target.nodeField] = nextNode;
    }

    await (this.prisma as any)[target.model].updateMany({
      data,
      where: this.buildBusinessTargetWhere(target, businessId, businessNo),
    });
  }

  private mapActionToWorkbenchStatus(action?: null | string, fallback = '') {
    if (action === 'approve') {
      return '1';
    }
    if (action === 'reject') {
      return '2';
    }
    if (action === 'withdraw') {
      return '3';
    }
    return fallback;
  }

  private mapActionToBusinessFlowStatus(action?: null | string, fallback = '') {
    if (action === 'submit' || action === 'approve') {
      return '1';
    }
    if (action === 'reject' || action === 'withdraw') {
      return '0';
    }
    return fallback;
  }

  private matchesLocalWorkbenchQueryType(
    item: Record<string, unknown>,
    queryType: string,
    userId: string,
  ) {
    const latestAction = pickFirstString(item, ['__latestAction']);
    const submitUserId = pickFirstString(item, ['__submitUserId']);
    const status = pickFirstString(item, ['status']);

    switch (queryType) {
      case 'approved': {
        return latestAction === 'approve' || status === '1';
      }
      case 'cc': {
        return false;
      }
      case 'done': {
        return ['approve', 'reject', 'withdraw'].includes(latestAction);
      }
      case 'initiate':
      case 'my-submit': {
        return !userId || submitUserId === userId;
      }
      case 'my-todo':
      case 'todo': {
        return status === '0' && (!userId || submitUserId !== userId);
      }
      case 'pending': {
        return status === '0';
      }
      default: {
        return true;
      }
    }
  }

  private async resolveBusinessTarget(
    businessType?: string,
    businessNo?: string,
  ): Promise<null | WorkflowBusinessTarget> {
    const normalizedType = `${businessType || ''}`.trim().toLowerCase();
    const normalizedNo = `${businessNo || ''}`.trim();

    const preferredTarget = normalizedType
      ? WORKFLOW_BUSINESS_TARGETS.find((item) => item.aliases.includes(normalizedType))
      : undefined;

    if (preferredTarget) {
      return preferredTarget;
    }

    if (!normalizedNo) {
      return null;
    }

    for (const target of WORKFLOW_BUSINESS_TARGETS) {
      if (target.matchByIdOnly || target.noFields.length === 0) {
        continue;
      }
      const row = await (this.prisma as any)[target.model].findFirst({
        select: Object.fromEntries(target.noFields.map((field) => [field, true])),
        where: this.buildBusinessNoWhere(target.noFields, normalizedNo),
      });
      if (row) {
        return target;
      }
    }

    return null;
  }

  private async loadLocalWorkbenchSourceRows(
    businessGroups: Array<{
      businessId?: string;
      businessNo: string;
      businessType: string;
    }>,
  ) {
    const groupedByModel = new Map<
      string,
      {
        ids: bigint[];
        nos: string[];
        source: LocalWorkbenchSource;
      }
    >();

    for (const group of businessGroups) {
      const source = this.resolveLocalWorkbenchSource(group.businessType);
      if (!source) {
        continue;
      }

      const modelGroup = groupedByModel.get(source.model) || {
        ids: [],
        nos: [],
        source,
      };

      if (source.matchByIdOnly) {
        if (group.businessId) {
          try {
            modelGroup.ids.push(BigInt(group.businessId));
          } catch {
            // Ignore invalid business ids from incomplete legacy/local records.
          }
        }
      } else if (group.businessNo) {
        modelGroup.nos.push(group.businessNo);
      }

      groupedByModel.set(source.model, modelGroup);
    }

    const rowsByModel = new Map<string, Map<string, Record<string, unknown>>>();
    for (const [model, modelGroup] of groupedByModel.entries()) {
      const rows: Record<string, unknown>[] = await (this.prisma as any)[model].findMany({
        where: this.buildLocalWorkbenchSourceWhere(
          modelGroup.source,
          modelGroup.ids,
          modelGroup.nos,
        ),
      });
      const rowMap = new Map<string, Record<string, unknown>>();
      for (const row of rows) {
        if (modelGroup.source.matchByIdOnly) {
          const rowId = pickFirstString(row, ['id']);
          if (rowId) {
            rowMap.set(rowId, row);
          }
          continue;
        }

        for (const field of modelGroup.source.noFields) {
          const fieldValue = pickFirstString(row, [field]);
          if (fieldValue) {
            rowMap.set(fieldValue, row);
          }
        }
      }
      rowsByModel.set(model, rowMap);
    }

    return rowsByModel;
  }

  private buildLocalWorkbenchItem(
    group: {
      businessId?: string;
      businessNo: string;
      businessType: string;
      latestRecord: any;
      submitRecord?: any;
    },
    rowsByModel: Map<string, Map<string, Record<string, unknown>>>,
  ) {
    const source = this.resolveLocalWorkbenchSource(group.businessType);
    if (!source) {
      return null;
    }

    const sourceRows = rowsByModel.get(source.model);
    const sourceKey = source.matchByIdOnly ? `${group.businessId || ''}`.trim() : group.businessNo;
    const row = sourceKey ? sourceRows?.get(sourceKey) : undefined;
    const currentNode =
      (source.nodeField ? pickFirstString(row || {}, [source.nodeField]) : '') ||
      `${group.latestRecord.nodeName || ''}`.trim();
    const title =
      pickFirstString(row || {}, source.titleFields) ||
      `${group.latestRecord.remark || ''}`.trim() ||
      group.businessNo;
    const applyUser =
      pickFirstString(row || {}, source.applicantFields) ||
      `${group.submitRecord?.approverName || group.submitRecord?.createBy || ''}`.trim() ||
      `${group.latestRecord.approverName || group.latestRecord.createBy || ''}`.trim();
    const applyTime =
      pickFirstString(row || {}, source.timeFields) ||
      `${group.submitRecord?.approvalTime || group.submitRecord?.createTime || ''}`.trim() ||
      `${group.latestRecord.approvalTime || group.latestRecord.createTime || ''}`.trim();
    const businessId = group.businessId || `${(row as any)?.id || ''}`.trim();

    const businessCategory = this.resolveBusinessCategory(group.businessType, row || {});

    return {
      __latestAction: pickFirstString(group.latestRecord, ['approvalAction']),
      __submitUserId: pickFirstString(group.submitRecord || {}, ['approverUserId']),
      applyId: businessId || group.businessNo,
      applyTime,
      applyTitle: title,
      applyUser,
      businessCategory,
      businessType: group.businessType,
      currentHandler:
        this.resolveLocalWorkbenchStatus(
          currentNode,
          `${group.latestRecord.approvalAction || ''}`,
        ) === '0'
          ? '待处理'
          : `${group.latestRecord.approverName || ''}`.trim(),
      currentNode,
      flowId: businessId || group.businessNo,
      flowNo: group.businessNo,
      raw: {
        ...(row || {}),
        businessId,
        businessNo: group.businessNo,
        businessType: group.businessType,
        currentNode,
        title,
      },
      status: this.resolveLocalWorkbenchStatus(
        currentNode,
        `${group.latestRecord.approvalAction || ''}`.trim(),
      ),
      title,
    };
  }

  private buildLocalWorkbenchSourceWhere(
    source: LocalWorkbenchSource,
    ids: bigint[],
    nos: string[],
  ) {
    if (source.matchByIdOnly) {
      return ids.length > 0 ? { id: { in: ids } } : { id: { in: [] } };
    }

    if (source.noFields.length === 1) {
      return { [source.noFields[0]]: { in: nos } };
    }

    return {
      OR: source.noFields.map((field) => ({
        [field]: { in: nos },
      })),
    };
  }

  private resolveLocalWorkbenchSource(businessType: string) {
    const normalizedType = `${businessType || ''}`.trim().toLowerCase();
    return LOCAL_WORKBENCH_SOURCES.find((item) => item.businessTypes.includes(normalizedType));
  }

  private resolveLocalWorkbenchStatus(currentNode: string, latestAction: string) {
    if (latestAction === 'reject') {
      return '2';
    }
    if (latestAction === 'withdraw') {
      return '3';
    }
    if (latestAction === 'submit') {
      return '0';
    }
    if (latestAction === 'approve') {
      return currentNode && currentNode !== '流程结束' ? '0' : '1';
    }
    return '0';
  }

  private resolveBusinessCategory(
    businessType: string,
    item: Record<string, unknown>,
  ): 'expense' | 'loan' | 'refund' | '' {
    const normalizedType = `${businessType || ''}`.trim().toLowerCase();
    if (!['expense-claim', 'expense_claim', 'claim', 'reimbursement'].includes(normalizedType)) {
      return '';
    }

    const claimType = pickFirstString(item, ['claimType']).toLowerCase();
    const title = pickFirstString(item, ['title', 'applyTitle', 'billTitle']).toLowerCase();
    const loanTotal = Number(pickFirstString(item, ['loanTotal']) || 0);
    const refundAmount = Number(pickFirstString(item, ['refundAmount']) || 0);

    if (refundAmount > 0 || claimType.includes('退款') || title.includes('退款')) {
      return 'refund';
    }
    if (loanTotal > 0 || claimType.includes('借款') || title.includes('借款')) {
      return 'loan';
    }
    return 'expense';
  }

  private buildBusinessNoWhere(noFields: string[], businessNo: string) {
    return noFields.length === 1
      ? { [noFields[0]]: businessNo }
      : {
          OR: noFields.map((field) => ({ [field]: businessNo })),
        };
  }

  private buildBusinessTargetWhere(
    target: WorkflowBusinessTarget,
    businessId?: bigint,
    businessNo?: string,
  ) {
    const normalizedBusinessNo = `${businessNo || ''}`.trim();
    const conditions: Record<string, unknown>[] = [];

    if (businessId !== undefined) {
      conditions.push({ id: businessId });
    }

    if (!target.matchByIdOnly && normalizedBusinessNo) {
      conditions.push(
        target.noFields.length === 1
          ? { [target.noFields[0]]: normalizedBusinessNo }
          : {
              OR: target.noFields.map((field) => ({ [field]: normalizedBusinessNo })),
            },
      );
    }

    if (conditions.length === 0) {
      return {};
    }

    if (conditions.length === 1) {
      return conditions[0];
    }

    return { OR: conditions };
  }

  private resolveNextNode(model: string, action: WorkflowCommandAction, currentNode?: string) {
    const sequence = LOCAL_WORKFLOW_NODE_SEQUENCES[model];
    if (!sequence || sequence.length === 0) {
      return currentNode || undefined;
    }

    if (action === 'submit') {
      return sequence[1] || sequence[0];
    }

    if (action === 'withdraw' || action === 'reject') {
      return sequence[0];
    }

    if (action !== 'approve') {
      return currentNode || undefined;
    }

    const normalizedNode = `${currentNode || ''}`.trim() || sequence[1] || sequence[0];
    const currentIndex = sequence.findIndex((item) => item === normalizedNode);
    if (currentIndex < 0) {
      return sequence.at(-1);
    }

    return sequence[currentIndex + 1] || sequence.at(-1);
  }

  private normalizeBusinessNo(payload: WorkflowCommandPayload) {
    return `${payload.businessNo || payload.flowNo || ''}`.trim();
  }

  private normalizeBigInt(value?: number | string) {
    const normalized = `${value || ''}`.trim();
    if (!normalized) {
      return undefined;
    }

    try {
      return BigInt(normalized);
    } catch {
      return undefined;
    }
  }

  private async resolveActorProfile(actor: WorkflowActor) {
    const normalizedUserId = `${actor.userId || ''}`.trim();
    const user = normalizedUserId
      ? await this.prisma.sysUser.findUnique({
          where: { userId: BigInt(normalizedUserId) },
        })
      : null;
    const dept = user?.deptId
      ? await this.prisma.sysDept.findUnique({
          where: { deptId: Number(user.deptId) },
        })
      : null;

    return {
      deptId: user?.deptId || undefined,
      deptName: dept?.deptName || '',
      realName: actor.realName || user?.nickName || actor.username || '系统用户',
      userId: normalizedUserId ? BigInt(normalizedUserId) : undefined,
      username: actor.username || user?.userName || 'system',
    };
  }

  private serializeApprovalRecord(item: any) {
    return {
      ...item,
      approverDeptId: item.approverDeptId?.toString(),
      approverUserId: item.approverUserId?.toString(),
      businessId: item.businessId?.toString(),
      id: item.id.toString(),
    };
  }

  private serializeListItem(
    item: Record<string, unknown>,
    page: number,
    pageSize: number,
    index: number,
  ) {
    const rowId = `${page}-${pageSize}-${index + 1}`;
    const title = pickFirstString(item, [
      'title',
      'applyTitle',
      'flowTitle',
      'billTitle',
      'billName',
      'subject',
    ]);

    const flowId = pickFirstString(item, ['flowId', 'processId', 'instanceId', 'id']);
    const applyId = pickFirstString(item, ['applyId', 'billId', 'formId', 'id']);

    return {
      applyId: applyId || flowId || rowId,
      applyTime: pickFirstString(item, [
        'applyTime',
        'submitTime',
        'createTime',
        'applyDate',
        'createdAt',
      ]),
      applyTitle: title,
      applyUser: pickFirstString(item, [
        'applyUser',
        'applyUserName',
        'creatorName',
        'createBy',
        'submitter',
        'applicant',
      ]),
      businessCategory: this.resolveBusinessCategory(
        pickFirstString(item, ['businessType', 'business_type', 'formType']),
        item,
      ),
      businessType: pickFirstString(item, ['businessType', 'business_type', 'formType']),
      currentHandler: pickFirstString(item, [
        'currentHandler',
        'handlerName',
        'assigneeName',
        'auditUser',
        'approver',
      ]),
      currentNode: pickFirstString(item, [
        'currentNode',
        'currentNodeName',
        'nodeName',
        'taskName',
        'stepName',
      ]),
      flowId: flowId || applyId || rowId,
      flowNo: pickFirstString(item, [
        'flowNo',
        'flow_no',
        'billNo',
        'bill_no',
        'processNo',
        'instanceNo',
      ]),
      raw: item,
      status: pickFirstString(item, ['status', 'flowStatus', 'flow_status', 'approveStatus']),
      title,
    };
  }
}
