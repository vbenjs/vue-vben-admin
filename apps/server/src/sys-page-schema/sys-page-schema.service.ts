import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

type RuntimeMode = 'draft' | 'published';
type ScopeType = 'template' | 'tenant' | 'user';

type RuntimeOptions = {
  mode?: RuntimeMode;
  tenantId?: number;
  userId?: number | string;
};

function isRecord(value: unknown): value is Record<string, any> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function parseJson<T>(value: null | string | undefined, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function deepMerge(target: any, source: any): any {
  if (Array.isArray(source)) {
    return cloneJson(source);
  }

  if (!isRecord(target) || !isRecord(source)) {
    return source;
  }

  const merged = { ...target };
  Object.entries(source).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      merged[key] = cloneJson(value);
      return;
    }

    if (isRecord(value) && isRecord(merged[key])) {
      merged[key] = deepMerge(merged[key], value);
      return;
    }

    merged[key] = value;
  });

  return merged;
}

function sortByOrder(items: any[]) {
  const hasOrder = items.some((item) => isRecord(item) && typeof item.order === 'number');
  if (!hasOrder) {
    return items;
  }

  return items
    .map((item, index) => ({
      index,
      item,
      order:
        isRecord(item) && typeof item.order === 'number' ? item.order : Number.MAX_SAFE_INTEGER,
    }))
    .sort((left, right) => {
      if (left.order === right.order) {
        return left.index - right.index;
      }
      return left.order - right.order;
    })
    .map((entry) => entry.item);
}

function applyElementPatches(node: any, patchMap: Record<string, any>): any {
  if (Array.isArray(node)) {
    return sortByOrder(node.map((item) => applyElementPatches(item, patchMap)));
  }

  if (!isRecord(node)) {
    return node;
  }

  const next = { ...node };
  const elementKey = typeof next.key === 'string' ? next.key : '';
  if (elementKey && isRecord(patchMap[elementKey])) {
    Object.assign(next, cloneJson(patchMap[elementKey]));
  }

  Object.entries(next).forEach(([key, value]) => {
    if (Array.isArray(value) || isRecord(value)) {
      next[key] = applyElementPatches(value, patchMap);
    }
  });

  return next;
}

function buildRootPatch(patchMap: Record<string, any>) {
  let rootPatch: Record<string, any> = {};

  if (isRecord(patchMap.__root__)) {
    rootPatch = deepMerge(rootPatch, patchMap.__root__);
  }

  if (isRecord(patchMap.page)) {
    rootPatch = deepMerge(rootPatch, patchMap.page);
  }

  ['layout', 'dialog', 'table', 'form', 'searchSettings', 'toolbarSettings'].forEach((key) => {
    if (isRecord(patchMap[key])) {
      rootPatch = deepMerge(rootPatch, { [key]: patchMap[key] });
    }
  });

  return rootPatch;
}

function mergePageSchema(baseSchema: any, patchMap: any) {
  const normalizedBase = isRecord(baseSchema) ? cloneJson(baseSchema) : {};
  const normalizedPatchMap = isRecord(patchMap) ? patchMap : {};
  const rootPatched = deepMerge(normalizedBase, buildRootPatch(normalizedPatchMap));

  const elementPatchMap = Object.entries(normalizedPatchMap).reduce<Record<string, any>>(
    (acc, [key, value]) => {
      if (
        [
          '__root__',
          'dialog',
          'form',
          'layout',
          'page',
          'searchSettings',
          'table',
          'toolbarSettings',
        ].includes(key)
      ) {
        return acc;
      }
      acc[key] = value;
      return acc;
    },
    {},
  );

  return applyElementPatches(rootPatched, elementPatchMap);
}

@Injectable()
export class SysPageSchemaService {
  constructor(private readonly prisma: PrismaService) {}

  async createTemplate(data: any, username: string) {
    const payload = this.normalizeTemplatePayload(data);
    this.ensureRequiredText(payload.pageCode, 'pageCode');
    this.ensureRequiredText(payload.pageName, 'pageName');
    const pageCode = payload.pageCode as string;
    const pageName = payload.pageName as string;
    const { pageCode: _pageCode, pageName: _pageName, ...restPayload } = payload;

    const created = await this.prisma.sysPageTemplate.create({
      data: {
        ...restPayload,
        createBy: username,
        pageCode,
        pageName,
        updateBy: username,
      },
    });

    return this.serializeTemplate(created);
  }

  async updateTemplate(id: number, data: any, username: string) {
    const payload = this.normalizeTemplatePayload(data);
    const updated = await this.prisma.sysPageTemplate.update({
      where: { templateId: BigInt(id) },
      data: {
        ...payload,
        updateBy: username,
      },
    });

    return this.serializeTemplate(updated);
  }

  async removeTemplate(id: number) {
    const removed = await this.prisma.sysPageTemplate.delete({
      where: { templateId: BigInt(id) },
    });
    return this.serializeTemplate(removed);
  }

  async findTemplateOne(id: number) {
    const template = await this.prisma.sysPageTemplate.findUnique({
      where: { templateId: BigInt(id) },
    });
    return this.serializeTemplate(template);
  }

  async findTemplateList(params: {
    page?: number;
    pageCode?: string;
    pageName?: string;
    pageSize?: number;
    status?: string;
  }) {
    const page = Number(params.page || 1);
    const pageSize = Number(params.pageSize || 20);
    const skip = (page - 1) * pageSize;
    const where = {
      ...(params.pageCode ? { pageCode: { contains: params.pageCode } } : {}),
      ...(params.pageName ? { pageName: { contains: params.pageName } } : {}),
      ...(params.status ? { status: params.status } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.sysPageTemplate.findMany({
        skip,
        take: pageSize,
        where,
        orderBy: [{ updateTime: 'desc' }, { createTime: 'desc' }],
      }),
      this.prisma.sysPageTemplate.count({ where }),
    ]);

    return {
      items: items.map((item) => this.serializeTemplate(item)),
      total,
    };
  }

  async publishTemplate(id: number, username: string) {
    const template = await this.prisma.sysPageTemplate.findUnique({
      where: { templateId: BigInt(id) },
    });
    if (!template) {
      throw new NotFoundException('页面模板不存在');
    }

    const snapshotJson = this.requireDraftPayload(
      template.schemaJson,
      '页面模板草稿为空，无法发布',
    );
    const versionNo = (template.currentVersion || 0) + 1;

    const updated = await this.prisma.$transaction(async (tx) => {
      const record = await tx.sysPageTemplate.update({
        where: { templateId: template.templateId },
        data: {
          currentVersion: versionNo,
          publishedSchemaJson: snapshotJson,
          updateBy: username,
        },
      });

      await tx.sysPagePublishLog.create({
        data: {
          actionType: 'publish',
          operatorName: username,
          pageCode: template.pageCode,
          remark: template.remark,
          scopeKey: 'template',
          scopeType: 'template',
          snapshotJson,
          targetId: template.templateId,
          versionNo,
        },
      });

      return record;
    });

    return this.serializeTemplate(updated);
  }

  async rollbackTemplate(id: number, logId: number, username: string) {
    const template = await this.prisma.sysPageTemplate.findUnique({
      where: { templateId: BigInt(id) },
    });
    if (!template) {
      throw new NotFoundException('页面模板不存在');
    }

    const log = await this.getPublishLogOrThrow(BigInt(logId), 'template', 'template');
    const snapshotJson = this.requireDraftPayload(log.snapshotJson, '发布快照为空，无法回滚');
    const versionNo = (template.currentVersion || 0) + 1;

    const updated = await this.prisma.$transaction(async (tx) => {
      const record = await tx.sysPageTemplate.update({
        where: { templateId: template.templateId },
        data: {
          currentVersion: versionNo,
          publishedSchemaJson: snapshotJson,
          updateBy: username,
        },
      });

      await tx.sysPagePublishLog.create({
        data: {
          actionType: 'rollback',
          operatorName: username,
          pageCode: template.pageCode,
          remark: `回滚到版本 ${log.versionNo}`,
          scopeKey: 'template',
          scopeType: 'template',
          snapshotJson,
          targetId: template.templateId,
          versionNo,
        },
      });

      return record;
    });

    return this.serializeTemplate(updated);
  }

  async listTemplateLogs(id: number) {
    const template = await this.prisma.sysPageTemplate.findUnique({
      where: { templateId: BigInt(id) },
    });
    if (!template) {
      throw new NotFoundException('页面模板不存在');
    }
    return this.listPublishLogs(template.pageCode, 'template', 'template');
  }

  async getTenantOverride(pageCode: string, tenantId: number) {
    const record = await this.prisma.sysPageOverride.findUnique({
      where: {
        uniq_sys_page_override_page_tenant: {
          pageCode,
          tenantId,
        },
      },
    });
    return this.serializeOverride(record);
  }

  async saveTenantOverride(pageCode: string, tenantId: number, data: any, username: string) {
    if (!tenantId) {
      throw new BadRequestException('tenantId 不能为空');
    }

    const payload = this.normalizeOverridePayload(data);
    const saved = await this.prisma.sysPageOverride.upsert({
      where: {
        uniq_sys_page_override_page_tenant: {
          pageCode,
          tenantId,
        },
      },
      create: {
        ...payload,
        createBy: username,
        pageCode,
        tenantId,
        updateBy: username,
      },
      update: {
        ...payload,
        updateBy: username,
      },
    });

    return this.serializeOverride(saved);
  }

  async publishTenantOverride(pageCode: string, tenantId: number, username: string) {
    const record = await this.prisma.sysPageOverride.findUnique({
      where: {
        uniq_sys_page_override_page_tenant: {
          pageCode,
          tenantId,
        },
      },
    });
    if (!record) {
      throw new NotFoundException('租户页面覆盖不存在');
    }

    const snapshotJson = this.requireDraftPayload(record.patchJson, '租户覆盖草稿为空，无法发布');
    const versionNo = (record.currentVersion || 0) + 1;
    const scopeKey = this.getTenantScopeKey(tenantId);

    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.sysPageOverride.update({
        where: { overrideId: record.overrideId },
        data: {
          currentVersion: versionNo,
          publishedPatchJson: snapshotJson,
          updateBy: username,
        },
      });

      await tx.sysPagePublishLog.create({
        data: {
          actionType: 'publish',
          operatorName: username,
          pageCode,
          remark: record.remark,
          scopeKey,
          scopeType: 'tenant',
          snapshotJson,
          targetId: record.overrideId,
          versionNo,
        },
      });

      return next;
    });

    return this.serializeOverride(updated);
  }

  async rollbackTenantOverride(
    pageCode: string,
    tenantId: number,
    logId: number,
    username: string,
  ) {
    const record = await this.prisma.sysPageOverride.findUnique({
      where: {
        uniq_sys_page_override_page_tenant: {
          pageCode,
          tenantId,
        },
      },
    });
    if (!record) {
      throw new NotFoundException('租户页面覆盖不存在');
    }

    const scopeKey = this.getTenantScopeKey(tenantId);
    const log = await this.getPublishLogOrThrow(BigInt(logId), 'tenant', scopeKey);
    const snapshotJson = this.requireDraftPayload(log.snapshotJson, '发布快照为空，无法回滚');
    const versionNo = (record.currentVersion || 0) + 1;

    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.sysPageOverride.update({
        where: { overrideId: record.overrideId },
        data: {
          currentVersion: versionNo,
          publishedPatchJson: snapshotJson,
          updateBy: username,
        },
      });

      await tx.sysPagePublishLog.create({
        data: {
          actionType: 'rollback',
          operatorName: username,
          pageCode,
          remark: `回滚到版本 ${log.versionNo}`,
          scopeKey,
          scopeType: 'tenant',
          snapshotJson,
          targetId: record.overrideId,
          versionNo,
        },
      });

      return next;
    });

    return this.serializeOverride(updated);
  }

  async listTenantLogs(pageCode: string, tenantId: number) {
    return this.listPublishLogs(pageCode, 'tenant', this.getTenantScopeKey(tenantId));
  }

  async getUserPreference(pageCode: string, tenantId: number, userId: string) {
    const record = await this.prisma.sysUserPagePreference.findUnique({
      where: {
        uniq_sys_user_page_preference_page_tenant_user: {
          pageCode,
          tenantId,
          userId: BigInt(userId),
        },
      },
    });

    return this.serializePreference(record);
  }

  async saveUserPreference(
    pageCode: string,
    tenantId: number,
    userId: string,
    data: any,
    username: string,
  ) {
    this.ensureRequiredText(userId, 'userId');

    const payload = this.normalizePreferencePayload(data);
    const saved = await this.prisma.sysUserPagePreference.upsert({
      where: {
        uniq_sys_user_page_preference_page_tenant_user: {
          pageCode,
          tenantId,
          userId: BigInt(userId),
        },
      },
      create: {
        ...payload,
        createBy: username,
        pageCode,
        tenantId,
        updateBy: username,
        userId: BigInt(userId),
      },
      update: {
        ...payload,
        updateBy: username,
      },
    });

    return this.serializePreference(saved);
  }

  async publishUserPreference(
    pageCode: string,
    tenantId: number,
    userId: string,
    username: string,
  ) {
    const record = await this.prisma.sysUserPagePreference.findUnique({
      where: {
        uniq_sys_user_page_preference_page_tenant_user: {
          pageCode,
          tenantId,
          userId: BigInt(userId),
        },
      },
    });
    if (!record) {
      throw new NotFoundException('个人页面偏好不存在');
    }

    const snapshotJson = this.requireDraftPayload(record.patchJson, '个人偏好草稿为空，无法发布');
    const versionNo = (record.currentVersion || 0) + 1;
    const scopeKey = this.getUserScopeKey(tenantId, userId);

    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.sysUserPagePreference.update({
        where: { preferenceId: record.preferenceId },
        data: {
          currentVersion: versionNo,
          publishedPatchJson: snapshotJson,
          updateBy: username,
        },
      });

      await tx.sysPagePublishLog.create({
        data: {
          actionType: 'publish',
          operatorName: username,
          pageCode,
          remark: record.remark,
          scopeKey,
          scopeType: 'user',
          snapshotJson,
          targetId: record.preferenceId,
          versionNo,
        },
      });

      return next;
    });

    return this.serializePreference(updated);
  }

  async rollbackUserPreference(
    pageCode: string,
    tenantId: number,
    userId: string,
    logId: number,
    username: string,
  ) {
    const record = await this.prisma.sysUserPagePreference.findUnique({
      where: {
        uniq_sys_user_page_preference_page_tenant_user: {
          pageCode,
          tenantId,
          userId: BigInt(userId),
        },
      },
    });
    if (!record) {
      throw new NotFoundException('个人页面偏好不存在');
    }

    const scopeKey = this.getUserScopeKey(tenantId, userId);
    const log = await this.getPublishLogOrThrow(BigInt(logId), 'user', scopeKey);
    const snapshotJson = this.requireDraftPayload(log.snapshotJson, '发布快照为空，无法回滚');
    const versionNo = (record.currentVersion || 0) + 1;

    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.sysUserPagePreference.update({
        where: { preferenceId: record.preferenceId },
        data: {
          currentVersion: versionNo,
          publishedPatchJson: snapshotJson,
          updateBy: username,
        },
      });

      await tx.sysPagePublishLog.create({
        data: {
          actionType: 'rollback',
          operatorName: username,
          pageCode,
          remark: `回滚到版本 ${log.versionNo}`,
          scopeKey,
          scopeType: 'user',
          snapshotJson,
          targetId: record.preferenceId,
          versionNo,
        },
      });

      return next;
    });

    return this.serializePreference(updated);
  }

  async listUserLogs(pageCode: string, tenantId: number, userId: string) {
    return this.listPublishLogs(pageCode, 'user', this.getUserScopeKey(tenantId, userId));
  }

  async getRuntime(pageCode: string, options: RuntimeOptions = {}) {
    const mode = options.mode || 'published';
    const tenantId = options.tenantId;
    const userId = this.normalizeOptionalString(options.userId);

    const template = await this.prisma.sysPageTemplate.findUnique({
      where: { pageCode },
    });
    if (!template) {
      return {
        available: false,
        mode,
        pageCode,
        schema: {},
        sources: {
          preferenceId: null,
          templateId: null,
          tenantId: tenantId || null,
          overrideId: null,
          userId: userId || null,
        },
        versions: {
          template: 0,
          tenant: 0,
          user: 0,
        },
      };
    }

    const tenantOverride =
      tenantId !== undefined
        ? await this.prisma.sysPageOverride.findUnique({
            where: {
              uniq_sys_page_override_page_tenant: {
                pageCode,
                tenantId,
              },
            },
          })
        : null;

    const userPreference =
      tenantId !== undefined && userId
        ? await this.prisma.sysUserPagePreference.findUnique({
            where: {
              uniq_sys_user_page_preference_page_tenant_user: {
                pageCode,
                tenantId,
                userId: BigInt(userId),
              },
            },
          })
        : null;

    const baseSchema = parseJson(this.resolveTemplateSchema(template, mode), {});
    const tenantPatch = parseJson(this.resolveLayerPatch(tenantOverride, mode), {});
    const userPatch = parseJson(this.resolveLayerPatch(userPreference, mode), {});
    const mergedSchema = mergePageSchema(mergePageSchema(baseSchema, tenantPatch), userPatch);

    return {
      available: true,
      mode,
      pageCode,
      pageName: template.pageName,
      schema: mergedSchema,
      sources: {
        preferenceId: userPreference?.preferenceId?.toString() || null,
        templateId: template.templateId.toString(),
        tenantId: tenantId || null,
        overrideId: tenantOverride?.overrideId?.toString() || null,
        userId: userId || null,
      },
      versions: {
        template: template.currentVersion || 0,
        tenant: tenantOverride?.currentVersion || 0,
        user: userPreference?.currentVersion || 0,
      },
    };
  }

  private async listPublishLogs(pageCode: string, scopeType: ScopeType, scopeKey: string) {
    const logs = await this.prisma.sysPagePublishLog.findMany({
      where: {
        pageCode,
        scopeKey,
        scopeType,
      },
      orderBy: [{ versionNo: 'desc' }, { createTime: 'desc' }],
    });

    return logs.map((item) => this.serializeLog(item));
  }

  private async getPublishLogOrThrow(logId: bigint, scopeType: ScopeType, scopeKey: string) {
    const log = await this.prisma.sysPagePublishLog.findUnique({
      where: { logId },
    });
    if (!log || log.scopeType !== scopeType || log.scopeKey !== scopeKey) {
      throw new NotFoundException('发布记录不存在');
    }
    return log;
  }

  private resolveTemplateSchema(template: any, mode: RuntimeMode) {
    if (!template) {
      return '{}';
    }
    return mode === 'draft'
      ? template.schemaJson || template.publishedSchemaJson || '{}'
      : template.publishedSchemaJson || '{}';
  }

  private resolveLayerPatch(layer: any, mode: RuntimeMode) {
    if (!layer) {
      return '{}';
    }
    return mode === 'draft'
      ? layer.patchJson || layer.publishedPatchJson || '{}'
      : layer.publishedPatchJson || '{}';
  }

  private ensureRequiredText(value: null | string | undefined, fieldName: string) {
    if (!value || !`${value}`.trim()) {
      throw new BadRequestException(`${fieldName} 不能为空`);
    }
  }

  private requireDraftPayload(value: null | string | undefined, message: string) {
    const normalized = `${value || ''}`.trim();
    if (!normalized) {
      throw new BadRequestException(message);
    }
    return normalized;
  }

  private normalizeTemplatePayload(data: any) {
    const payload: Record<string, any> = {};
    const pageCode = this.normalizeOptionalString(data.pageCode);
    const pageName = this.normalizeOptionalString(data.pageName || data.formName);
    const schemaJson = this.normalizeJsonInput(data.schemaJson ?? data.schema ?? data.pageSchema);
    const publishedSchemaJson = this.normalizeJsonInput(data.publishedSchemaJson);

    if (pageCode !== undefined) {
      payload.pageCode = pageCode;
    }
    if (pageName !== undefined) {
      payload.pageName = pageName;
    }
    if (schemaJson !== undefined) {
      payload.schemaJson = schemaJson;
    }
    if (publishedSchemaJson !== undefined) {
      payload.publishedSchemaJson = publishedSchemaJson;
    }
    if (data.currentVersion !== undefined) {
      payload.currentVersion = Number(data.currentVersion) || 0;
    }
    if (data.status !== undefined) {
      payload.status = `${data.status || '0'}`;
    }
    if (data.remark !== undefined) {
      payload.remark = this.normalizeOptionalString(data.remark) || '';
    }

    const sourcePageMetaId = this.normalizeOptionalBigInt(data.sourcePageMetaId);
    if (sourcePageMetaId !== undefined) {
      payload.sourcePageMetaId = sourcePageMetaId;
    }

    return payload;
  }

  private normalizeOverridePayload(data: any) {
    const payload: Record<string, any> = {};
    const patchJson = this.normalizeJsonInput(data.patchJson ?? data.patch);
    const publishedPatchJson = this.normalizeJsonInput(data.publishedPatchJson);

    if (patchJson !== undefined) {
      payload.patchJson = patchJson;
    }
    if (publishedPatchJson !== undefined) {
      payload.publishedPatchJson = publishedPatchJson;
    }
    if (data.currentVersion !== undefined) {
      payload.currentVersion = Number(data.currentVersion) || 0;
    }
    if (data.status !== undefined) {
      payload.status = `${data.status || '0'}`;
    }
    if (data.remark !== undefined) {
      payload.remark = this.normalizeOptionalString(data.remark) || '';
    }

    return payload;
  }

  private normalizePreferencePayload(data: any) {
    return this.normalizeOverridePayload(data);
  }

  private normalizeJsonInput(value: unknown) {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return '{}';
    }

    if (typeof value === 'string') {
      return value.trim() || '{}';
    }

    return JSON.stringify(value);
  }

  private normalizeOptionalBigInt(value: unknown) {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (typeof value === 'string') {
      const normalized = value.trim();
      return normalized ? BigInt(normalized) : undefined;
    }

    if (typeof value === 'number' || typeof value === 'bigint') {
      return BigInt(value);
    }

    throw new BadRequestException('BigInt 字段格式非法');
  }

  private normalizeOptionalString(value: unknown) {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (typeof value === 'string') {
      return value.trim() || undefined;
    }

    if (typeof value === 'number' || typeof value === 'bigint' || typeof value === 'boolean') {
      return String(value);
    }

    return undefined;
  }

  private getTenantScopeKey(tenantId: number) {
    return `tenant:${tenantId}`;
  }

  private getUserScopeKey(tenantId: number, userId: string) {
    return `tenant:${tenantId}:user:${userId}`;
  }

  private serializeTemplate(item: any) {
    if (!item) {
      return null;
    }

    return {
      ...item,
      sourcePageMetaId: item.sourcePageMetaId?.toString() || null,
      templateId: item.templateId.toString(),
    };
  }

  private serializeOverride(item: any) {
    if (!item) {
      return null;
    }

    return {
      ...item,
      overrideId: item.overrideId.toString(),
    };
  }

  private serializePreference(item: any) {
    if (!item) {
      return null;
    }

    return {
      ...item,
      preferenceId: item.preferenceId.toString(),
      userId: item.userId.toString(),
    };
  }

  private serializeLog(item: any) {
    return {
      ...item,
      logId: item.logId.toString(),
      targetId: item.targetId?.toString() || null,
    };
  }
}
