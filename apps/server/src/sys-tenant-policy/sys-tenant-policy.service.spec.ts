import type { PrismaService } from '../prisma/prisma.service';

import { SysTenantPolicyService } from './sys-tenant-policy.service';

describe('SysTenantPolicyService', () => {
  it('saves, publishes, rolls back, and lists tenant policy logs', async () => {
    const tx = {
      sysTenantPolicy: {
        update: jest
          .fn()
          .mockResolvedValueOnce({
            currentVersion: 1,
            policyId: BigInt(11),
            policyType: 'pageRuntime',
            publishedPolicyJson:
              '{"fields":{"form.basic.amount":{"required":true}}}',
            sceneCode: 'finance.income-settlement',
            tenantId: 7,
          })
          .mockResolvedValueOnce({
            currentVersion: 2,
            policyId: BigInt(11),
            policyType: 'pageRuntime',
            publishedPolicyJson:
              '{"fields":{"form.basic.amount":{"required":false}}}',
            sceneCode: 'finance.income-settlement',
            tenantId: 7,
          }),
      },
      sysTenantPolicyLog: {
        create: jest.fn().mockResolvedValue(undefined),
      },
    };

    const prisma = {
      $transaction: jest
        .fn()
        .mockImplementation(async (callback: any) => callback(tx)),
      sysTenantPolicy: {
        findUnique: jest
          .fn()
          .mockResolvedValueOnce({
            currentVersion: 0,
            policyId: BigInt(11),
            policyJson: '{"fields":{"form.basic.amount":{"required":true}}}',
            policyType: 'pageRuntime',
            remark: 'phase-1',
            sceneCode: 'finance.income-settlement',
            tenantId: 7,
          })
          .mockResolvedValueOnce({
            currentVersion: 1,
            policyId: BigInt(11),
            policyJson: '{"fields":{"form.basic.amount":{"required":true}}}',
            policyType: 'pageRuntime',
            remark: 'phase-1',
            sceneCode: 'finance.income-settlement',
            tenantId: 7,
          }),
        upsert: jest.fn().mockResolvedValue({
          currentVersion: 0,
          policyId: BigInt(11),
          policyJson: '{"fields":{"form.basic.amount":{"required":true}}}',
          policyType: 'pageRuntime',
          sceneCode: 'finance.income-settlement',
          tenantId: 7,
        }),
      },
      sysTenantPolicyLog: {
        findMany: jest.fn().mockResolvedValue([
          {
            actionType: 'rollback',
            createTime: new Date('2026-04-06T10:10:00.000Z'),
            logId: BigInt(91),
            operatorName: 'admin',
            policyType: 'pageRuntime',
            sceneCode: 'finance.income-settlement',
            snapshotJson: '{"fields":{"form.basic.amount":{"required":false}}}',
            targetId: BigInt(11),
            tenantId: 7,
            versionNo: 2,
          },
          {
            actionType: 'publish',
            createTime: new Date('2026-04-06T10:00:00.000Z'),
            logId: BigInt(90),
            operatorName: 'admin',
            policyType: 'pageRuntime',
            sceneCode: 'finance.income-settlement',
            snapshotJson: '{"fields":{"form.basic.amount":{"required":true}}}',
            targetId: BigInt(11),
            tenantId: 7,
            versionNo: 1,
          },
        ]),
        findUnique: jest.fn().mockResolvedValue({
          actionType: 'publish',
          createTime: new Date('2026-04-06T10:00:00.000Z'),
          logId: BigInt(90),
          operatorName: 'admin',
          policyType: 'pageRuntime',
          sceneCode: 'finance.income-settlement',
          snapshotJson: '{"fields":{"form.basic.amount":{"required":false}}}',
          targetId: BigInt(11),
          tenantId: 7,
          versionNo: 1,
        }),
      },
    };

    const service = new SysTenantPolicyService(
      prisma as unknown as PrismaService,
    );

    await service.savePolicy(
      'finance.income-settlement',
      7,
      {
        policyJson: {
          fields: { 'form.basic.amount': { required: true } },
        },
        policyType: 'pageRuntime',
      },
      'admin',
    );
    const published = await service.publishPolicy(
      'finance.income-settlement',
      7,
      'pageRuntime',
      'admin',
    );
    const rolledBack = await service.rollbackPolicy(
      'finance.income-settlement',
      7,
      'pageRuntime',
      90,
      'admin',
    );
    const logs = await service.listPolicyLogs(
      'finance.income-settlement',
      7,
      'pageRuntime',
    );

    expect(published.currentVersion).toBe(1);
    expect(rolledBack.currentVersion).toBe(2);
    expect(tx.sysTenantPolicyLog.create).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: expect.objectContaining({
          actionType: 'publish',
          policyType: 'pageRuntime',
          sceneCode: 'finance.income-settlement',
          tenantId: 7,
          versionNo: 1,
        }),
      }),
    );
    expect(tx.sysTenantPolicyLog.create).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: expect.objectContaining({
          actionType: 'rollback',
          policyType: 'pageRuntime',
          sceneCode: 'finance.income-settlement',
          tenantId: 7,
          versionNo: 2,
        }),
      }),
    );
    expect(logs[0]).toMatchObject({
      actionType: 'rollback',
      policyType: 'pageRuntime',
      sceneCode: 'finance.income-settlement',
      tenantId: 7,
      versionNo: 2,
    });
  });
});
