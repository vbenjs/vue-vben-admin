import type { PrismaService } from '../prisma/prisma.service';

import { SysPageSchemaService } from './sys-page-schema.service';

describe('SysPageSchemaService', () => {
  it('merges template, tenant override and user preference by element key', async () => {
    const prisma = {
      sysPageTemplate: {
        findUnique: jest.fn().mockResolvedValue({
          currentVersion: 2,
          pageCode: 'finance.reimbursement.query',
          pageName: '报销单查询',
          publishedSchemaJson: JSON.stringify({
            layout: { dialogMode: 'drawer', type: 'legacy-list' },
            search: [
              {
                component: 'input',
                key: 'search.billNo',
                label: '单据号',
                order: 20,
                visible: true,
              },
              {
                component: 'select',
                key: 'search.billType',
                label: '报账类型',
                order: 10,
                visible: true,
              },
            ],
            table: {
              columns: [
                { key: 'table.billNo', label: '单据号', order: 20, width: 160 },
                { key: 'table.amount', label: '申请金额', order: 30, width: 120 },
              ],
            },
          }),
          templateId: BigInt(1),
        }),
      },
      sysPageOverride: {
        findUnique: jest.fn().mockResolvedValue({
          currentVersion: 1,
          overrideId: BigInt(2),
          publishedPatchJson: JSON.stringify({
            'search.billType': { visible: false },
            'table.amount': { order: 10, width: 150 },
            layout: { dialogMode: 'fullscreen' },
          }),
        }),
      },
      sysTenantPolicy: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
      sysUserPagePreference: {
        findUnique: jest.fn().mockResolvedValue({
          currentVersion: 3,
          preferenceId: BigInt(3),
          publishedPatchJson: JSON.stringify({
            'table.billNo': { order: 30, width: 220 },
          }),
        }),
      },
    };

    const service = new SysPageSchemaService(prisma as unknown as PrismaService);
    const result = await service.getRuntime('finance.reimbursement.query', {
      mode: 'published',
      tenantId: 1,
      userId: '8',
    });

    expect(result.available).toBe(true);
    expect(result.schema.layout).toMatchObject({ dialogMode: 'fullscreen' });
    expect(result.schema.search[0]).toMatchObject({
      key: 'search.billType',
      visible: false,
    });
    expect(result.schema.table.columns[0]).toMatchObject({
      key: 'table.amount',
      width: 150,
    });
    expect(result.schema.table.columns[1]).toMatchObject({
      key: 'table.billNo',
      width: 220,
    });
  });

  it('returns policy, context, and policy version in runtime payload', async () => {
    const prisma = {
      sysPageTemplate: {
        findUnique: jest.fn().mockResolvedValue({
          currentVersion: 2,
          pageCode: 'finance.reimbursement.query',
          pageName: '报销单查询',
          publishedSchemaJson:
            '{"search":[{"key":"search.status","visible":true}]}',
          templateId: BigInt(1),
        }),
      },
      sysPageOverride: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
      sysTenantPolicy: {
        findUnique: jest.fn().mockResolvedValue({
          currentVersion: 4,
          policyId: BigInt(22),
          policyType: 'pageRuntime',
          publishedPolicyJson:
            '{"fields":{"search.status":{"defaultValue":"1"}},"actions":{"toolbar.history":{"visible":false}}}',
          sceneCode: 'finance.reimbursement.query',
          tenantId: 7,
        }),
      },
      sysUserPagePreference: {
        findUnique: jest.fn().mockResolvedValue({
          currentVersion: 1,
          preferenceId: BigInt(9),
          publishedPatchJson: '{"toolbar.history":{"visible":true}}',
        }),
      },
    };

    const service = new SysPageSchemaService(prisma as unknown as PrismaService);
    const result = await service.getRuntime('finance.reimbursement.query', {
      mode: 'published',
      requestContext: { fiscalYear: '2026', tenantId: 7, tenantName: '华南院' },
      tenantId: 7,
      userId: '18',
    });

    expect(result.context).toMatchObject({
      fiscalYear: '2026',
      tenantId: 7,
      tenantName: '华南院',
    });
    expect(result.policy.fields['search.status']).toMatchObject({
      defaultValue: '1',
    });
    expect(result.versions.policy).toBe(4);
    expect(result.sources.policyId).toBe('22');
    expect(result.schema.toolbar?.history?.visible).not.toBe(true);
  });

  it('publishes template draft into published snapshot and logs version', async () => {
    const tx = {
      sysPagePublishLog: {
        create: jest.fn().mockResolvedValue(undefined),
      },
      sysPageTemplate: {
        update: jest.fn().mockResolvedValue({
          currentVersion: 1,
          pageCode: 'finance.reimbursement.query',
          pageName: '报销单查询',
          publishedSchemaJson: '{"layout":{"type":"legacy-list"}}',
          sourcePageMetaId: null,
          status: '0',
          templateId: BigInt(1),
        }),
      },
    };
    const prisma = {
      $transaction: jest.fn().mockImplementation(async (callback: any) => callback(tx)),
      sysPageTemplate: {
        findUnique: jest.fn().mockResolvedValue({
          currentVersion: 0,
          pageCode: 'finance.reimbursement.query',
          pageName: '报销单查询',
          remark: '模板备注',
          schemaJson: '{"layout":{"type":"legacy-list"}}',
          templateId: BigInt(1),
        }),
      },
    };

    const service = new SysPageSchemaService(prisma as unknown as PrismaService);
    const result = await service.publishTemplate(1, 'admin');

    expect(tx.sysPageTemplate.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          currentVersion: 1,
          publishedSchemaJson: '{"layout":{"type":"legacy-list"}}',
          updateBy: 'admin',
        }),
      }),
    );
    expect(tx.sysPagePublishLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          actionType: 'publish',
          operatorName: 'admin',
          pageCode: 'finance.reimbursement.query',
          scopeKey: 'template',
          scopeType: 'template',
          versionNo: 1,
        }),
      }),
    );
    expect(result.currentVersion).toBe(1);
  });
});
