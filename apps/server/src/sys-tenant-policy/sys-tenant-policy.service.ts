import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { normalizeTenantPolicy } from './sys-tenant-policy.runtime';

@Injectable()
export class SysTenantPolicyService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublishedPolicyByScene(
    sceneCode: string,
    tenantId?: number,
    policyType = 'pageRuntime',
  ) {
    if (!tenantId) {
      return normalizeTenantPolicy({});
    }

    const record = await this.prisma.sysTenantPolicy.findUnique({
      where: {
        uniq_sys_tenant_policy_scope: {
          moduleCode: this.resolveModuleCode(sceneCode),
          policyType: this.normalizePolicyType(policyType),
          sceneCode,
          tenantId,
        },
      },
    });

    return normalizeTenantPolicy(this.parseJson(record?.publishedPolicyJson));
  }

  async getPolicy(sceneCode: string, tenantId: number, policyType = 'pageRuntime') {
    const record = await this.prisma.sysTenantPolicy.findUnique({
      where: {
        uniq_sys_tenant_policy_scope: {
          moduleCode: this.resolveModuleCode(sceneCode),
          policyType,
          sceneCode,
          tenantId,
        },
      },
    });

    return this.serializePolicy(record);
  }

  async savePolicy(sceneCode: string, tenantId: number, data: any, username: string) {
    const policyType = this.normalizePolicyType(data?.policyType);
    const saved = await this.prisma.sysTenantPolicy.upsert({
      where: {
        uniq_sys_tenant_policy_scope: {
          moduleCode: this.resolveModuleCode(sceneCode),
          policyType,
          sceneCode,
          tenantId,
        },
      },
      create: {
        createBy: username,
        moduleCode: this.resolveModuleCode(sceneCode),
        policyJson: this.normalizeJsonInput(data?.policyJson),
        policyType,
        remark: this.normalizeOptionalString(data?.remark) || '',
        sceneCode,
        tenantId,
        updateBy: username,
      },
      update: {
        policyJson: this.normalizeJsonInput(data?.policyJson),
        policyType,
        remark: this.normalizeOptionalString(data?.remark) || '',
        updateBy: username,
      },
    });

    return this.serializePolicy(saved);
  }

  async publishPolicy(
    sceneCode: string,
    tenantId: number,
    policyType: string,
    username: string,
  ) {
    const normalizedPolicyType = this.normalizePolicyType(policyType);
    const record = await this.requirePolicyRecord(
      sceneCode,
      tenantId,
      normalizedPolicyType,
    );
    const snapshotJson = this.requireSnapshot(
      record.policyJson,
      '租户策略草稿为空，无法发布',
    );
    const versionNo = (record.currentVersion || 0) + 1;

    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.sysTenantPolicy.update({
        where: { policyId: record.policyId },
        data: {
          currentVersion: versionNo,
          publishedPolicyJson: snapshotJson,
          updateBy: username,
        },
      });

      await tx.sysTenantPolicyLog.create({
        data: {
          actionType: 'publish',
          moduleCode: this.resolveModuleCode(sceneCode),
          operatorName: username,
          policyType: normalizedPolicyType,
          sceneCode,
          snapshotJson,
          targetId: record.policyId,
          tenantId,
          versionNo,
        },
      });

      return next;
    });

    return this.serializePolicy(updated);
  }

  async rollbackPolicy(
    sceneCode: string,
    tenantId: number,
    policyType: string,
    logId: number,
    username: string,
  ) {
    const normalizedPolicyType = this.normalizePolicyType(policyType);
    const record = await this.requirePolicyRecord(
      sceneCode,
      tenantId,
      normalizedPolicyType,
    );
    const log = await this.prisma.sysTenantPolicyLog.findUnique({
      where: { logId: BigInt(logId) },
    });

    if (
      !log ||
      log.tenantId !== tenantId ||
      log.sceneCode !== sceneCode ||
      log.policyType !== normalizedPolicyType
    ) {
      throw new NotFoundException('租户策略发布记录不存在');
    }

    const snapshotJson = this.requireSnapshot(
      log.snapshotJson,
      '租户策略发布快照为空，无法回滚',
    );
    const versionNo = (record.currentVersion || 0) + 1;

    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.sysTenantPolicy.update({
        where: { policyId: record.policyId },
        data: {
          currentVersion: versionNo,
          publishedPolicyJson: snapshotJson,
          updateBy: username,
        },
      });

      await tx.sysTenantPolicyLog.create({
        data: {
          actionType: 'rollback',
          moduleCode: this.resolveModuleCode(sceneCode),
          operatorName: username,
          policyType: normalizedPolicyType,
          remark: `回滚到版本 ${log.versionNo || 0}`,
          sceneCode,
          snapshotJson,
          targetId: record.policyId,
          tenantId,
          versionNo,
        },
      });

      return next;
    });

    return this.serializePolicy(updated);
  }

  async listPolicyLogs(sceneCode: string, tenantId: number, policyType: string) {
    const logs = await this.prisma.sysTenantPolicyLog.findMany({
      where: {
        moduleCode: this.resolveModuleCode(sceneCode),
        policyType: this.normalizePolicyType(policyType),
        sceneCode,
        tenantId,
      },
      orderBy: [{ versionNo: 'desc' }, { createTime: 'desc' }],
    });

    return logs.map((item) => this.serializeLog(item));
  }

  private async requirePolicyRecord(
    sceneCode: string,
    tenantId: number,
    policyType: string,
  ) {
    const record = await this.prisma.sysTenantPolicy.findUnique({
      where: {
        uniq_sys_tenant_policy_scope: {
          moduleCode: this.resolveModuleCode(sceneCode),
          policyType,
          sceneCode,
          tenantId,
        },
      },
    });

    if (!record) {
      throw new NotFoundException('租户策略不存在');
    }

    return record;
  }

  private normalizeJsonInput(value: unknown) {
    if (value === undefined || value === null) {
      return '{}';
    }

    if (typeof value === 'string') {
      return value.trim() || '{}';
    }

    return JSON.stringify(value);
  }

  private parseJson(value: null | string | undefined) {
    if (!value) {
      return {};
    }

    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
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

  private normalizePolicyType(value: unknown) {
    return this.normalizeOptionalString(value) || 'pageRuntime';
  }

  private requireSnapshot(value: null | string | undefined, message: string) {
    const normalized = `${value || ''}`.trim();
    if (!normalized) {
      throw new BadRequestException(message);
    }
    return normalized;
  }

  private resolveModuleCode(sceneCode: string) {
    const normalized = `${sceneCode || ''}`.trim();
    return normalized.split('.')[0] || 'sys';
  }

  private serializePolicy(item: any) {
    if (!item) {
      return null;
    }

    return {
      ...item,
      policyId: item.policyId?.toString() || null,
    };
  }

  private serializeLog(item: any) {
    return {
      ...item,
      logId: item.logId?.toString() || null,
      targetId: item.targetId?.toString() || null,
    };
  }
}
