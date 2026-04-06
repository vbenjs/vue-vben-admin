# Customer Personalization Runtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add tenant-scoped policy runtime on top of the existing page-schema runtime, wire it into finance pilot pages, and expose a tenant-policy admin page without forking business logic per customer.

**Architecture:** Keep the existing `sys_page_template` / `sys_page_override` / `sys_user_page_preference` flow and add a parallel `sys_tenant_policy` lifecycle for field behavior, action availability, attachment rules, and print bindings. The backend returns a single runtime payload with `schema`, `policy`, `context`, `sources`, and `versions`; the frontend consumes that payload through one composable and applies it consistently across admin tools and pilot pages.

**Tech Stack:** NestJS, Prisma, Jest, Vue 3, Ant Design Vue, Vitest, pnpm

---

## Implementation Notes

- Preserve existing in-progress runtime-page work in the current tree. Do not reset or overwrite unrelated edits in `apps/server/src/sys-page-schema`, `apps/web-antd/src/composables/usePageSchema.ts`, or the finance pilot pages.
- Use `sceneCode === pageCode` for phase 1. Derive `moduleCode` from `sceneCode.split('.')[0]`.
- Use `policyType === 'pageRuntime'` for phase 1. Keep the column so later phases can add print-only or workflow-only policies without schema churn.
- Treat tenant policy as a hard ceiling. User preference can refine convenience, but must never re-enable hidden actions or writable fields disabled by tenant policy.

## File Map

### Backend

- Modify: `apps/server/prisma/schema.prisma`
  - Add `SysTenantPolicy` and `SysTenantPolicyLog` Prisma models.
- Create: `apps/server/prisma/migrations/20260406153000_add_sys_tenant_policy_tables/migration.sql`
  - Persist the new policy tables and indexes.
- Create: `apps/server/src/sys-tenant-policy/sys-tenant-policy.module.ts`
  - Nest module for tenant policy CRUD and runtime helpers.
- Create: `apps/server/src/sys-tenant-policy/sys-tenant-policy.controller.ts`
  - HTTP endpoints for get/save/publish/rollback/logs.
- Create: `apps/server/src/sys-tenant-policy/sys-tenant-policy.service.ts`
  - CRUD, publish, rollback, log persistence, and published-policy lookup.
- Create: `apps/server/src/sys-tenant-policy/sys-tenant-policy.service.spec.ts`
  - Jest unit tests for persistence lifecycle.
- Create: `apps/server/src/sys-tenant-policy/sys-tenant-policy.runtime.ts`
  - Pure helpers for parsing policies, applying defaults, stripping forbidden preference patches, and enforcing policy rules.
- Create: `apps/server/src/sys-tenant-policy/sys-tenant-policy.runtime.spec.ts`
  - Jest unit tests for pure runtime helper behavior.
- Modify: `apps/server/src/app.module.ts`
  - Register `SysTenantPolicyModule`.
- Modify: `apps/server/src/sys-page-schema/sys-page-schema.service.ts`
  - Load published tenant policy into runtime responses and sanitize user preferences against policy ceilings.
- Modify: `apps/server/src/sys-page-schema/sys-page-schema.controller.ts`
  - Pass request context into runtime resolution.
- Modify: `apps/server/src/sys-page-schema/sys-page-schema.service.spec.ts`
  - Cover runtime `policy`, `context`, and `versions.policy`.
- Modify: `apps/server/src/income-settlement/income-settlement.controller.ts`
  - Forward request context into create/update flows.
- Modify: `apps/server/src/income-settlement/income-settlement.service.ts`
  - Apply defaults and enforce tenant policy on create/update.
- Create: `apps/server/src/income-settlement/income-settlement.service.spec.ts`
  - Cover required, readonly, and attachment rules.
- Modify: `apps/server/src/invoice-folder/invoice-folder.controller.ts`
  - Forward request context into create/update flows.
- Modify: `apps/server/src/invoice-folder/invoice-folder.service.ts`
  - Apply defaults and enforce tenant policy on create/update.
- Create: `apps/server/src/invoice-folder/invoice-folder.service.spec.ts`
  - Cover required, readonly, and action-related validation.
- Modify: `docs/src/riss-page-schema-runtime.md`
  - Document the new runtime payload and tenant policy layer after implementation stabilizes.

### Frontend

- Modify: `vitest.config.ts`
  - Add path aliases for `#` so web-antd runtime tests resolve app imports.
- Modify: `apps/web-antd/src/api/core/sys-manage.ts`
  - Add `sysTenantPolicyApi` methods.
- Create: `apps/web-antd/src/composables/useRuntimePageConfig.ts`
  - Runtime consumer for `schema`, `policy`, `context`, `sources`, and `versions`.
- Create: `apps/web-antd/src/composables/__tests__/useRuntimePageConfig.test.ts`
  - Vitest coverage for runtime policy resolution helpers.
- Create: `apps/web-antd/src/views/sys/tenant-policy/index.vue`
  - Tenant policy admin UI.
- Create: `apps/web-antd/src/views/sys/tenant-policy/__tests__/tenant-policy-page.test.ts`
  - Vitest coverage for tenant-policy admin page behavior.
- Modify: `apps/web-antd/src/router/routes/modules/sys.ts`
  - Add tenant policy route.
- Modify: `apps/server/src/app-menu/system-platform-menus.ts`
  - Add backend-driven menu item for tenant policy.
- Modify: `apps/web-antd/src/views/sys/form-design/page-meta.vue`
  - Extend runtime preview to show `policy` and `versions.policy`.
- Modify: `apps/web-antd/src/views/finance/_shared/FinanceQueryList.vue`
  - Use runtime policy for default filters and action visibility.
- Create: `apps/web-antd/src/views/finance/_shared/__tests__/FinanceQueryList.runtime.test.ts`
  - Vitest coverage for finance query runtime behavior.
- Modify: `apps/web-antd/src/views/finance/income-settlement/index.vue`
  - Use runtime policy for field defaults, readonly/required state, section hints, and attachment limits.
- Create: `apps/web-antd/src/views/finance/income-settlement/__tests__/index.runtime.test.ts`
  - Vitest coverage for income-settlement runtime behavior.
- Modify: `apps/web-antd/src/views/finance/invoice-folder/index.vue`
  - Use runtime policy for toolbar visibility, defaults, readonly fields, and folder constraints.
- Create: `apps/web-antd/src/views/finance/invoice-folder/__tests__/index.runtime.test.ts`
  - Vitest coverage for invoice-folder runtime behavior.

## Task 1: Add Tenant Policy Persistence and Lifecycle

**Files:**
- Create: `apps/server/src/sys-tenant-policy/sys-tenant-policy.module.ts`
- Create: `apps/server/src/sys-tenant-policy/sys-tenant-policy.controller.ts`
- Create: `apps/server/src/sys-tenant-policy/sys-tenant-policy.service.ts`
- Create: `apps/server/src/sys-tenant-policy/sys-tenant-policy.service.spec.ts`
- Modify: `apps/server/prisma/schema.prisma`
- Create: `apps/server/prisma/migrations/20260406153000_add_sys_tenant_policy_tables/migration.sql`
- Modify: `apps/server/src/app.module.ts`

- [ ] **Step 1: Write the failing service test**

```ts
import type { PrismaService } from '../prisma/prisma.service';

import { SysTenantPolicyService } from './sys-tenant-policy.service';

describe('SysTenantPolicyService', () => {
  it('saves, publishes, rolls back, and lists tenant policy logs', async () => {
    const tx = {
      sysTenantPolicy: {
        update: jest.fn().mockResolvedValue({
          currentVersion: 1,
          policyId: BigInt(11),
          publishedPolicyJson: '{"fields":{"form.basic.amount":{"required":true}}}',
          sceneCode: 'finance.income-settlement',
          tenantId: 7,
        }),
      },
      sysTenantPolicyLog: {
        create: jest.fn().mockResolvedValue(undefined),
      },
    };

    const prisma = {
      $transaction: jest.fn().mockImplementation(async (callback: any) => callback(tx)),
      sysTenantPolicy: {
        findUnique: jest.fn().mockResolvedValue({
          currentVersion: 0,
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
      },
    };

    const service = new SysTenantPolicyService(prisma as unknown as PrismaService);

    await service.savePolicy(
      'finance.income-settlement',
      7,
      { policyJson: { fields: { 'form.basic.amount': { required: true } } }, policyType: 'pageRuntime' },
      'admin',
    );
    const published = await service.publishPolicy(
      'finance.income-settlement',
      7,
      'pageRuntime',
      'admin',
    );
    const logs = await service.listPolicyLogs(
      'finance.income-settlement',
      7,
      'pageRuntime',
    );

    expect(published.currentVersion).toBe(1);
    expect(tx.sysTenantPolicyLog.create).toHaveBeenCalledWith(
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
    expect(logs[0]).toMatchObject({
      actionType: 'publish',
      policyType: 'pageRuntime',
      sceneCode: 'finance.income-settlement',
      tenantId: 7,
      versionNo: 1,
    });
  });
});
```

- [ ] **Step 2: Run the server test to verify it fails**

Run: `pnpm -C apps/server test -- sys-tenant-policy.service.spec.ts`

Expected: `FAIL` with `Cannot find module './sys-tenant-policy.service'` or missing Prisma model errors for `sysTenantPolicy`.

- [ ] **Step 3: Add Prisma models and migration**

```prisma
model SysTenantPolicy {
  policyId            BigInt   @id @default(autoincrement()) @map("policy_id")
  tenantId            Int      @map("tenant_id")
  moduleCode          String   @map("module_code") @db.VarChar(50)
  sceneCode           String   @map("scene_code") @db.VarChar(100)
  policyType          String   @default("pageRuntime") @map("policy_type") @db.VarChar(50)
  policyJson          String?  @map("policy_json") @db.LongText
  publishedPolicyJson String?  @map("published_policy_json") @db.LongText
  currentVersion      Int      @default(0) @map("current_version")
  status              String   @default("0") @db.VarChar(1)
  remark              String?  @db.VarChar(255)
  createBy            String?  @map("create_by") @db.VarChar(64)
  createTime          DateTime @default(now()) @map("create_time")
  updateBy            String?  @map("update_by") @db.VarChar(64)
  updateTime          DateTime @updatedAt @map("update_time")

  @@unique([tenantId, moduleCode, sceneCode, policyType], name: "uniq_sys_tenant_policy_scope")
  @@index([tenantId, status], name: "idx_sys_tenant_policy_tenant_status")
  @@map("sys_tenant_policy")
}

model SysTenantPolicyLog {
  logId        BigInt   @id @default(autoincrement()) @map("log_id")
  targetId     BigInt?  @map("target_id")
  tenantId     Int      @map("tenant_id")
  moduleCode   String   @map("module_code") @db.VarChar(50)
  sceneCode    String   @map("scene_code") @db.VarChar(100)
  policyType   String   @default("pageRuntime") @map("policy_type") @db.VarChar(50)
  actionType   String   @map("action_type") @db.VarChar(20)
  versionNo    Int      @map("version_no")
  snapshotJson String   @map("snapshot_json") @db.LongText
  operatorName String   @map("operator_name") @db.VarChar(64)
  remark       String?  @db.VarChar(255)
  createTime   DateTime @default(now()) @map("create_time")

  @@index([tenantId, sceneCode, policyType], name: "idx_sys_tenant_policy_log_scope")
  @@map("sys_tenant_policy_log")
}
```

Run after editing the schema: `pnpm -C apps/server exec prisma migrate dev --name add_sys_tenant_policy_tables`

- [ ] **Step 4: Implement the module, controller, and service**

```ts
@Controller('sys/tenant-policy')
export class SysTenantPolicyController {
  constructor(private readonly sysTenantPolicyService: SysTenantPolicyService) {}

  @Get(':sceneCode')
  getPolicy(
    @Param('sceneCode') sceneCode: string,
    @Query('tenantId') tenantId: string,
    @Query('policyType') policyType = 'pageRuntime',
  ) {
    return this.sysTenantPolicyService.getPolicy(sceneCode, Number(tenantId), policyType);
  }

  @Put(':sceneCode')
  savePolicy(
    @Param('sceneCode') sceneCode: string,
    @Body() body: any,
  ) {
    return this.sysTenantPolicyService.savePolicy(
      sceneCode,
      Number(body.tenantId),
      body,
      'admin',
    );
  }
}

@Injectable()
export class SysTenantPolicyService {
  constructor(private readonly prisma: PrismaService) {}

  async savePolicy(sceneCode: string, tenantId: number, data: any, username: string) {
    const moduleCode = sceneCode.split('.')[0] || 'sys';
    return this.prisma.sysTenantPolicy.upsert({
      where: {
        uniq_sys_tenant_policy_scope: {
          moduleCode,
          policyType: `${data.policyType || 'pageRuntime'}`,
          sceneCode,
          tenantId,
        },
      },
      create: {
        createBy: username,
        moduleCode,
        policyJson: JSON.stringify(data.policyJson || {}),
        policyType: `${data.policyType || 'pageRuntime'}`,
        remark: `${data.remark || ''}`,
        sceneCode,
        tenantId,
        updateBy: username,
      },
      update: {
        policyJson: JSON.stringify(data.policyJson || {}),
        remark: `${data.remark || ''}`,
        updateBy: username,
      },
    });
  }

  async publishPolicy(sceneCode: string, tenantId: number, policyType: string, username: string) {
    const moduleCode = sceneCode.split('.')[0] || 'sys';
    const record = await this.prisma.sysTenantPolicy.findUnique({
      where: {
        uniq_sys_tenant_policy_scope: { moduleCode, policyType, sceneCode, tenantId },
      },
    });
    const snapshotJson = record?.policyJson || '{}';
    const versionNo = (record?.currentVersion || 0) + 1;

    return this.prisma.$transaction(async (tx) => {
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
          moduleCode,
          operatorName: username,
          policyType,
          sceneCode,
          snapshotJson,
          targetId: record.policyId,
          tenantId,
          versionNo,
        },
      });
      return next;
    });
  }

  async rollbackPolicy(
    sceneCode: string,
    tenantId: number,
    policyType: string,
    logId: number,
    username: string,
  ) {
    const moduleCode = sceneCode.split('.')[0] || 'sys';
    const [record, log] = await Promise.all([
      this.prisma.sysTenantPolicy.findUnique({
        where: {
          uniq_sys_tenant_policy_scope: { moduleCode, policyType, sceneCode, tenantId },
        },
      }),
      this.prisma.sysTenantPolicyLog.findUnique({
        where: { logId: BigInt(logId) },
      }),
    ]);
    const snapshotJson = log?.snapshotJson || '{}';
    const versionNo = (record?.currentVersion || 0) + 1;

    return this.prisma.$transaction(async (tx) => {
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
          moduleCode,
          operatorName: username,
          policyType,
          remark: `回滚到版本 ${log?.versionNo || 0}`,
          sceneCode,
          snapshotJson,
          targetId: record.policyId,
          tenantId,
          versionNo,
        },
      });
      return next;
    });
  }

  async listPolicyLogs(sceneCode: string, tenantId: number, policyType: string) {
    const moduleCode = sceneCode.split('.')[0] || 'sys';
    return this.prisma.sysTenantPolicyLog.findMany({
      where: { moduleCode, policyType, sceneCode, tenantId },
      orderBy: [{ versionNo: 'desc' }, { createTime: 'desc' }],
    });
  }
}
```

Also register the module in `apps/server/src/app.module.ts`:

```ts
import { SysTenantPolicyModule } from './sys-tenant-policy/sys-tenant-policy.module';
// in the AppModule imports array
SysTenantPolicyModule,
```

- [ ] **Step 5: Run the server test to verify it passes**

Run: `pnpm -C apps/server test -- sys-tenant-policy.service.spec.ts`

Expected: `PASS apps/server/src/sys-tenant-policy/sys-tenant-policy.service.spec.ts`

- [ ] **Step 6: Commit**

```bash
git add apps/server/prisma/schema.prisma apps/server/prisma/migrations/20260406153000_add_sys_tenant_policy_tables/migration.sql apps/server/src/app.module.ts apps/server/src/sys-tenant-policy/sys-tenant-policy.module.ts apps/server/src/sys-tenant-policy/sys-tenant-policy.controller.ts apps/server/src/sys-tenant-policy/sys-tenant-policy.service.ts apps/server/src/sys-tenant-policy/sys-tenant-policy.service.spec.ts
git commit -m "feat(policy): add tenant policy lifecycle module"
```

## Task 2: Extend Runtime Resolution with Tenant Policy

**Files:**
- Create: `apps/server/src/sys-tenant-policy/sys-tenant-policy.runtime.ts`
- Create: `apps/server/src/sys-tenant-policy/sys-tenant-policy.runtime.spec.ts`
- Modify: `apps/server/src/sys-page-schema/sys-page-schema.service.ts`
- Modify: `apps/server/src/sys-page-schema/sys-page-schema.controller.ts`
- Modify: `apps/server/src/sys-page-schema/sys-page-schema.service.spec.ts`

- [ ] **Step 1: Write the failing runtime tests**

```ts
import type { PrismaService } from '../prisma/prisma.service';

import { SysPageSchemaService } from './sys-page-schema.service';

describe('SysPageSchemaService runtime', () => {
  it('returns policy, context, and policy version in runtime payload', async () => {
    const prisma = {
      sysPageTemplate: {
        findUnique: jest.fn().mockResolvedValue({
          currentVersion: 2,
          pageCode: 'finance.reimbursement.query',
          pageName: '报销单查询',
          publishedSchemaJson: '{"search":[{"key":"search.status","visible":true}]}',
          templateId: BigInt(1),
        }),
      },
      sysPageOverride: { findUnique: jest.fn().mockResolvedValue(null) },
      sysTenantPolicy: {
        findUnique: jest.fn().mockResolvedValue({
          currentVersion: 4,
          policyId: BigInt(22),
          policyType: 'pageRuntime',
          publishedPolicyJson: '{"fields":{"search.status":{"defaultValue":"1"}},"actions":{"toolbar.history":{"visible":false}}}',
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
    expect(result.policy.fields['search.status']).toMatchObject({ defaultValue: '1' });
    expect(result.versions.policy).toBe(4);
    expect(result.sources.policyId).toBe('22');
    expect(result.schema.toolbar?.history?.visible).not.toBe(true);
  });
});
```

- [ ] **Step 2: Run the runtime tests to verify they fail**

Run: `pnpm -C apps/server test -- sys-page-schema.service.spec.ts sys-tenant-policy.runtime.spec.ts`

Expected: `FAIL` because `policy`, `context`, and `versions.policy` are absent and the new runtime helper file does not exist yet.

- [ ] **Step 3: Implement pure policy runtime helpers**

```ts
export function normalizeTenantPolicy(raw: unknown) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { actions: {}, attachments: {}, fields: {}, print: {} };
  }
  const policy = raw as Record<string, any>;
  return {
    actions: policy.actions && typeof policy.actions === 'object' ? policy.actions : {},
    attachments:
      policy.attachments && typeof policy.attachments === 'object' ? policy.attachments : {},
    fields: policy.fields && typeof policy.fields === 'object' ? policy.fields : {},
    print: policy.print && typeof policy.print === 'object' ? policy.print : {},
  };
}

export function stripDisallowedPreferencePatch(
  patch: Record<string, any>,
  policy: ReturnType<typeof normalizeTenantPolicy>,
) {
  const next = JSON.parse(JSON.stringify(patch || {}));

  for (const [key, rule] of Object.entries(policy.fields)) {
    if (rule?.visible === false && next[key]?.visible === true) {
      delete next[key].visible;
    }
    if (rule?.readonly === true && next[key]?.readonly === false) {
      delete next[key].readonly;
    }
  }

  for (const [key, rule] of Object.entries(policy.actions)) {
    if ((rule?.visible === false || rule?.enabled === false) && next[key]) {
      delete next[key];
    }
  }

  return next;
}
```

- [ ] **Step 4: Load tenant policy into runtime responses**

```ts
type RuntimeOptions = {
  mode?: RuntimeMode;
  requestContext?: AppRequestContext;
  tenantId?: number;
  userId?: number | string;
};

const tenantPolicy =
  tenantId !== undefined
    ? await this.prisma.sysTenantPolicy.findUnique({
        where: {
          uniq_sys_tenant_policy_scope: {
            moduleCode: pageCode.split('.')[0] || 'sys',
            policyType: 'pageRuntime',
            sceneCode: pageCode,
            tenantId,
          },
        },
      })
    : null;

const policy = normalizeTenantPolicy(
  parseJson(
    mode === 'draft'
      ? tenantPolicy?.policyJson || tenantPolicy?.publishedPolicyJson || '{}'
      : tenantPolicy?.publishedPolicyJson || '{}',
    {},
  ),
);
const sanitizedUserPatch = stripDisallowedPreferencePatch(userPatch, policy);
const mergedSchema = mergePageSchema(mergePageSchema(baseSchema, tenantPatch), sanitizedUserPatch);

return {
  available: true,
  context: {
    fiscalYear: options.requestContext?.fiscalYear || '',
    tenantId: tenantId || null,
    tenantName: options.requestContext?.tenantName || '',
  },
  pageCode,
  pageName: template.pageName,
  policy,
  schema: mergedSchema,
  sources: {
    overrideId: tenantOverride?.overrideId?.toString() || null,
    policyId: tenantPolicy?.policyId?.toString() || null,
    preferenceId: userPreference?.preferenceId?.toString() || null,
    templateId: template.templateId.toString(),
  },
  versions: {
    policy: tenantPolicy?.currentVersion || 0,
    template: template.currentVersion || 0,
    tenant: tenantOverride?.currentVersion || 0,
    user: userPreference?.currentVersion || 0,
  },
};
```

Update the controller to pass request context:

```ts
return this.sysPageSchemaService.getRuntime(pageCode, {
  mode,
  requestContext: request?.requestContext,
  tenantId: this.resolveTenantId(tenantId, request?.requestContext, false, true),
  userId: await this.resolveUserId(userId, request, true),
});
```

- [ ] **Step 5: Run the runtime tests to verify they pass**

Run: `pnpm -C apps/server test -- sys-page-schema.service.spec.ts sys-tenant-policy.runtime.spec.ts`

Expected: `PASS` for both runtime specs with assertions on `policy`, `context`, `sources.policyId`, and `versions.policy`.

- [ ] **Step 6: Commit**

```bash
git add apps/server/src/sys-tenant-policy/sys-tenant-policy.runtime.ts apps/server/src/sys-tenant-policy/sys-tenant-policy.runtime.spec.ts apps/server/src/sys-page-schema/sys-page-schema.service.ts apps/server/src/sys-page-schema/sys-page-schema.controller.ts apps/server/src/sys-page-schema/sys-page-schema.service.spec.ts
git commit -m "feat(policy): include tenant policy in runtime payload"
```

## Task 3: Enforce Tenant Policy in Income Settlement Writes

**Files:**
- Modify: `apps/server/src/income-settlement/income-settlement.controller.ts`
- Modify: `apps/server/src/income-settlement/income-settlement.service.ts`
- Create: `apps/server/src/income-settlement/income-settlement.service.spec.ts`
- Modify: `apps/server/src/sys-tenant-policy/sys-tenant-policy.runtime.ts`

- [ ] **Step 1: Write the failing income-settlement policy test**

```ts
import type { AppRequestContext } from '../common/request-context/request-context.types';

import { IncomeSettlementService } from './income-settlement.service';

describe('IncomeSettlementService tenant policy', () => {
  it('rejects create when tenant policy marks content as required', async () => {
    const invoiceFolderService = { syncInvoiceBinding: jest.fn() };
    const sysFormDataService = { create: jest.fn() };
    const sysTenantPolicyService = {
      getPublishedPolicyByScene: jest.fn().mockResolvedValue({
        fields: {
          'form.basic.content': { required: true },
          'form.basic.receiptMethod': { defaultValue: '银行转账', readonly: true },
        },
      }),
    };

    const service = new IncomeSettlementService(
      invoiceFolderService as any,
      sysFormDataService as any,
      sysTenantPolicyService as any,
    );

    await expect(
      service.create(
        { amount: 100, applicant: '张三', content: '' },
        { tenantId: 7 } as AppRequestContext,
      ),
    ).rejects.toThrow('form.basic.content 为必填项');
  });
});
```

- [ ] **Step 2: Run the income-settlement test to verify it fails**

Run: `pnpm -C apps/server test -- income-settlement.service.spec.ts`

Expected: `FAIL` because `IncomeSettlementService` does not yet accept request context or tenant policy dependencies.

- [ ] **Step 3: Extend runtime helpers for defaults and validation**

```ts
export function applyPolicyDefaults<T extends Record<string, any>>(
  payload: T,
  policy: ReturnType<typeof normalizeTenantPolicy>,
  fieldAccessors: Record<string, { get: (payload: T) => unknown; set: (payload: T, value: unknown) => void }>,
) {
  const next = { ...payload };
  for (const [key, accessor] of Object.entries(fieldAccessors)) {
    const rule = policy.fields[key];
    if (rule?.defaultValue === undefined) {
      continue;
    }
    const currentValue = accessor.get(next);
    if (currentValue === undefined || currentValue === null || `${currentValue}`.trim?.() === '') {
      accessor.set(next, rule.defaultValue);
    }
  }
  return next;
}

export function assertPolicyPayload<T extends Record<string, any>>(
  payload: T,
  policy: ReturnType<typeof normalizeTenantPolicy>,
  fieldAccessors: Record<string, { get: (payload: T) => unknown }>,
) {
  for (const [key, accessor] of Object.entries(fieldAccessors)) {
    const rule = policy.fields[key];
    if (rule?.required) {
      const value = accessor.get(payload);
      if (value === undefined || value === null || `${value}`.trim?.() === '') {
        throw new BadRequestException(`${key} 为必填项`);
      }
    }
  }
}
```

- [ ] **Step 4: Wire tenant policy into create and update**

```ts
type IncomeFieldAccessors = Record<
  string,
  {
    get: (payload: IncomeSettlementItem) => unknown;
    set?: (payload: IncomeSettlementItem, value: unknown) => void;
  }
>;

const INCOME_SETTLEMENT_FIELD_ACCESSORS: IncomeFieldAccessors = {
  'form.basic.amount': {
    get: (payload) => payload.amount,
    set: (payload, value) => {
      payload.amount = Number(value || 0);
    },
  },
  'form.basic.content': {
    get: (payload) => payload.content,
    set: (payload, value) => {
      payload.content = `${value || ''}`;
    },
  },
  'form.basic.receiptMethod': {
    get: (payload) => payload.receiptMethod,
    set: (payload, value) => {
      payload.receiptMethod = `${value || ''}`;
    },
  },
};

async create(data: any, requestContext?: AppRequestContext) {
  const policy = await this.sysTenantPolicyService.getPublishedPolicyByScene(
    'finance.income-settlement',
    requestContext?.tenantId,
    'pageRuntime',
  );
  const normalized = this.normalizePayload(data);
  const payload = applyPolicyDefaults(normalized, policy, INCOME_SETTLEMENT_FIELD_ACCESSORS);
  assertPolicyPayload(payload, policy, INCOME_SETTLEMENT_FIELD_ACCESSORS);
  const result = await this.sysFormDataService.create({
    createBy: payload.applicant || 'admin',
    formData: JSON.stringify(payload),
    formId: INCOME_SETTLEMENT_FORM_ID.toString(),
    remark: payload.remark || '',
  });
  await this.syncInvoiceBinding(payload);
  return this.mergeMeta(result, payload);
}

async update(id: bigint, data: any, requestContext?: AppRequestContext) {
  const current = await this.getById(id);
  const policy = await this.sysTenantPolicyService.getPublishedPolicyByScene(
    'finance.income-settlement',
    requestContext?.tenantId,
    'pageRuntime',
  );
  const normalized = this.normalizePayload({
    ...(current || {}),
    ...data,
  });
  const payload = applyPolicyDefaults(normalized, policy, INCOME_SETTLEMENT_FIELD_ACCESSORS);
  assertPolicyPayload(payload, policy, INCOME_SETTLEMENT_FIELD_ACCESSORS);
  const result = await this.sysFormDataService.update(id, {
    formData: JSON.stringify(payload),
    remark: payload.remark || '',
  });
  await this.syncInvoiceBinding(payload);
  return this.mergeMeta(result, payload);
}
```

Update the controller signatures:

```ts
@Post()
async create(@Body() data: any, @Req() request: RequestWithContext) {
  return this.incomeSettlementService.create(data, request.requestContext);
}

@Put(':id')
async update(@Param('id') id: string, @Body() data: any, @Req() request: RequestWithContext) {
  return this.incomeSettlementService.update(BigInt(id), data, request.requestContext);
}
```

- [ ] **Step 5: Run the income-settlement test to verify it passes**

Run: `pnpm -C apps/server test -- income-settlement.service.spec.ts`

Expected: `PASS apps/server/src/income-settlement/income-settlement.service.spec.ts`

- [ ] **Step 6: Commit**

```bash
git add apps/server/src/sys-tenant-policy/sys-tenant-policy.runtime.ts apps/server/src/income-settlement/income-settlement.controller.ts apps/server/src/income-settlement/income-settlement.service.ts apps/server/src/income-settlement/income-settlement.service.spec.ts
git commit -m "feat(policy): enforce tenant policy for income settlement"
```

## Task 4: Enforce Tenant Policy in Invoice Folder Writes

**Files:**
- Modify: `apps/server/src/invoice-folder/invoice-folder.controller.ts`
- Modify: `apps/server/src/invoice-folder/invoice-folder.service.ts`
- Create: `apps/server/src/invoice-folder/invoice-folder.service.spec.ts`

- [ ] **Step 1: Write the failing invoice-folder policy test**

```ts
import type { AppRequestContext } from '../common/request-context/request-context.types';

import { InvoiceFolderService } from './invoice-folder.service';

describe('InvoiceFolderService tenant policy', () => {
  it('applies default invoice type and rejects empty invoice number when required', async () => {
    const sysFormDataService = { create: jest.fn() };
    const sysTenantPolicyService = {
      getPublishedPolicyByScene: jest.fn().mockResolvedValue({
        fields: {
          'form.basic.invoiceNo': { required: true },
          'form.basic.invoiceType': { defaultValue: '电子票据' },
        },
      }),
    };

    const service = new InvoiceFolderService(
      sysFormDataService as any,
      sysTenantPolicyService as any,
    );

    await expect(
      service.create(
        { amount: 88.6, fileName: '票据.pdf', invoiceNo: '' },
        { tenantId: 7 } as AppRequestContext,
      ),
    ).rejects.toThrow('form.basic.invoiceNo 为必填项');
  });
});
```

- [ ] **Step 2: Run the invoice-folder test to verify it fails**

Run: `pnpm -C apps/server test -- invoice-folder.service.spec.ts`

Expected: `FAIL` because `InvoiceFolderService` does not yet read tenant policy or accept request context.

- [ ] **Step 3: Implement invoice-folder field accessors and controller context**

```ts
const INVOICE_FOLDER_FIELD_ACCESSORS = {
  'form.basic.invoiceNo': {
    get: (payload: InvoiceFolderItem) => payload.invoiceNo,
    set: (payload: InvoiceFolderItem, value: unknown) => {
      payload.invoiceNo = `${value || ''}`;
    },
  },
  'form.basic.invoiceType': {
    get: (payload: InvoiceFolderItem) => payload.invoiceType,
    set: (payload: InvoiceFolderItem, value: unknown) => {
      payload.invoiceType = `${value || ''}`;
    },
  },
  'form.basic.folderName': {
    get: (payload: InvoiceFolderItem) => payload.folderName,
    set: (payload: InvoiceFolderItem, value: unknown) => {
      payload.folderName = `${value || ''}`;
    },
  },
};

async create(data: any, requestContext?: AppRequestContext) {
  const policy = await this.sysTenantPolicyService.getPublishedPolicyByScene(
    'finance.invoice-folder',
    requestContext?.tenantId,
    'pageRuntime',
  );
  const normalized = this.normalizePayload(data);
  const payload = applyPolicyDefaults(normalized, policy, INVOICE_FOLDER_FIELD_ACCESSORS);
  assertPolicyPayload(payload, policy, INVOICE_FOLDER_FIELD_ACCESSORS);
  const result = await this.sysFormDataService.create({
    createBy: payload.userName || 'admin',
    formData: JSON.stringify(payload),
    formId: INVOICE_FOLDER_FORM_ID.toString(),
    remark: payload.remark || '',
  });
  return this.mergeMeta(result, payload);
}
```

Update the controller signatures:

```ts
@Post()
async create(@Body() data: any, @Req() request: RequestWithContext) {
  return this.invoiceFolderService.create(data, request.requestContext);
}

@Put(':id')
async update(@Param('id') id: string, @Body() data: any, @Req() request: RequestWithContext) {
  return this.invoiceFolderService.update(BigInt(id), data, request.requestContext);
}
```

- [ ] **Step 4: Run the invoice-folder test to verify it passes**

Run: `pnpm -C apps/server test -- invoice-folder.service.spec.ts`

Expected: `PASS apps/server/src/invoice-folder/invoice-folder.service.spec.ts`

- [ ] **Step 5: Commit**

```bash
git add apps/server/src/invoice-folder/invoice-folder.controller.ts apps/server/src/invoice-folder/invoice-folder.service.ts apps/server/src/invoice-folder/invoice-folder.service.spec.ts
git commit -m "feat(policy): enforce tenant policy for invoice folder"
```

## Task 5: Add Frontend Runtime Composable and Test Harness

**Files:**
- Modify: `vitest.config.ts`
- Modify: `apps/web-antd/src/api/core/sys-manage.ts`
- Create: `apps/web-antd/src/composables/useRuntimePageConfig.ts`
- Create: `apps/web-antd/src/composables/__tests__/useRuntimePageConfig.test.ts`

- [ ] **Step 1: Write the failing composable test**

```ts
import { flushPromises, mount } from '@vue/test-utils';
import { ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('#/composables/usePageSchema', () => ({
  usePageSchema: () => ({
    loading: ref(false),
    refresh: vi.fn(),
    runtime: ref({
      context: { fiscalYear: '2026', tenantId: 7, tenantName: '华南院' },
      policy: {
        actions: { 'toolbar.history': { enabled: false, visible: false } },
        attachments: { 'attachment.invoice': { maxCount: 2 } },
        fields: { 'search.status': { defaultValue: '1' } },
      },
      schema: { search: [] },
      versions: { policy: 4, template: 2, tenant: 1, user: 0 },
    }),
    schema: ref({ search: [] }),
  }),
}));

import { useRuntimePageConfig } from '../useRuntimePageConfig';

describe('useRuntimePageConfig', () => {
  it('exposes field, action, and attachment policy helpers', async () => {
    const wrapper = mount({
      setup() {
        return useRuntimePageConfig('finance.reimbursement.query');
      },
      template: '<div />',
    });

    await flushPromises();

    expect(wrapper.vm.resolveFieldPolicy('search.status')).toMatchObject({ defaultValue: '1' });
    expect(wrapper.vm.resolveActionPolicy('toolbar.history')).toMatchObject({
      enabled: false,
      visible: false,
    });
    expect(wrapper.vm.resolveAttachmentPolicy('attachment.invoice')).toMatchObject({ maxCount: 2 });
    expect(wrapper.vm.versions.policy).toBe(4);
  });
});
```

- [ ] **Step 2: Run the frontend test to verify it fails**

Run: `pnpm test:unit -- apps/web-antd/src/composables/__tests__/useRuntimePageConfig.test.ts`

Expected: `FAIL` with alias resolution errors for `#` or `Cannot find module '../useRuntimePageConfig'`.

- [ ] **Step 3: Add alias resolution and runtime API/composable**

```ts
// vitest.config.ts
import { resolve } from 'node:path';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [Vue(), VueJsx()],
  resolve: {
    alias: {
      '#': resolve(__dirname, 'apps/web-antd/src'),
    },
  },
  test: {
    environment: 'happy-dom',
    exclude: [
      ...configDefaults.exclude,
      '**/apps/server/**',
      '**/e2e/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/node_modules/**',
      '**/{stylelint,eslint}.config.*',
      '.prettierrc.mjs',
    ],
  },
});
```

```ts
// apps/web-antd/src/api/core/sys-manage.ts
export const sysTenantPolicyApi = {
  getPolicy: (sceneCode: string, params?: any) =>
    requestClient.get(`/sys/tenant-policy/${sceneCode}`, { params }),
  savePolicy: (sceneCode: string, data: any) =>
    requestClient.put(`/sys/tenant-policy/${sceneCode}`, data),
  publishPolicy: (sceneCode: string, data?: any) =>
    requestClient.post(`/sys/tenant-policy/${sceneCode}/publish`, data || {}),
  rollbackPolicy: (sceneCode: string, logId: number | string, data?: any) =>
    requestClient.post(`/sys/tenant-policy/${sceneCode}/rollback/${logId}`, data || {}),
  getLogs: (sceneCode: string, params?: any) =>
    requestClient.get(`/sys/tenant-policy/${sceneCode}/logs`, { params }),
};
```

```ts
// apps/web-antd/src/composables/useRuntimePageConfig.ts
import type { MaybeRefOrGetter } from 'vue';

import { computed } from 'vue';

import { usePageSchema } from './usePageSchema';

export function useRuntimePageConfig(
  pageCode: MaybeRefOrGetter<string>,
  options: Record<string, any> = {},
) {
  const { loading, refresh, runtime, schema } = usePageSchema(pageCode, options);
  const policy = computed(() => runtime.value?.policy || { actions: {}, attachments: {}, fields: {}, print: {} });
  const context = computed(() => runtime.value?.context || {});
  const versions = computed(() => runtime.value?.versions || {});
  const sources = computed(() => runtime.value?.sources || {});

  const resolveFieldPolicy = (key: string) => policy.value.fields?.[key] || {};
  const resolveActionPolicy = (key: string) => policy.value.actions?.[key] || {};
  const resolveAttachmentPolicy = (key: string) => policy.value.attachments?.[key] || {};

  return {
    context,
    loading,
    policy,
    refresh,
    resolveActionPolicy,
    resolveAttachmentPolicy,
    resolveFieldPolicy,
    runtime,
    schema,
    sources,
    versions,
  };
}
```

- [ ] **Step 4: Run the frontend test to verify it passes**

Run: `pnpm test:unit -- apps/web-antd/src/composables/__tests__/useRuntimePageConfig.test.ts`

Expected: `PASS apps/web-antd/src/composables/__tests__/useRuntimePageConfig.test.ts`

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts apps/web-antd/src/api/core/sys-manage.ts apps/web-antd/src/composables/useRuntimePageConfig.ts apps/web-antd/src/composables/__tests__/useRuntimePageConfig.test.ts
git commit -m "feat(policy): add runtime page config composable"
```

## Task 6: Build Tenant Policy Admin UI and Runtime Preview

**Files:**
- Create: `apps/web-antd/src/views/sys/tenant-policy/index.vue`
- Create: `apps/web-antd/src/views/sys/tenant-policy/__tests__/tenant-policy-page.test.ts`
- Modify: `apps/web-antd/src/router/routes/modules/sys.ts`
- Modify: `apps/server/src/app-menu/system-platform-menus.ts`
- Modify: `apps/web-antd/src/views/sys/form-design/page-meta.vue`

- [ ] **Step 1: Write the failing tenant-policy admin page test**

```ts
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('#/api/core/sys-manage', () => ({
  sysPageSchemaApi: {
    getRuntime: vi.fn().mockResolvedValue({
      policy: { fields: { 'form.basic.amount': { required: true } } },
      schema: {},
      versions: { policy: 3, template: 2, tenant: 1, user: 0 },
    }),
  },
  sysTenantApi: {
    getList: vi.fn().mockResolvedValue({
      items: [{ tenantId: 7, tenantName: '华南院', status: '0' }],
    }),
  },
  sysTenantPolicyApi: {
    getLogs: vi.fn().mockResolvedValue([]),
    getPolicy: vi.fn().mockResolvedValue({
      currentVersion: 0,
      policyJson: '{}',
      policyType: 'pageRuntime',
      sceneCode: 'finance.reimbursement.query',
      tenantId: 7,
    }),
    publishPolicy: vi.fn().mockResolvedValue(undefined),
    savePolicy: vi.fn().mockResolvedValue(undefined),
  },
}));

import TenantPolicyPage from '../index.vue';

describe('tenant policy page', () => {
  it('loads tenants and shows runtime policy preview', async () => {
    const wrapper = mount(TenantPolicyPage);
    await flushPromises();

    expect(wrapper.text()).toContain('租户策略设置');
    expect(wrapper.text()).toContain('华南院');
    expect(wrapper.text()).toContain('运行态预览');
  });
});
```

- [ ] **Step 2: Run the admin page test to verify it fails**

Run: `pnpm test:unit -- apps/web-antd/src/views/sys/tenant-policy/__tests__/tenant-policy-page.test.ts`

Expected: `FAIL` because `#/views/sys/tenant-policy/index.vue` does not exist yet.

- [ ] **Step 3: Implement the page, route, menu, and preview**

```ts
// apps/web-antd/src/router/routes/modules/sys.ts
{
  name: 'SysTenantPolicy',
  path: '/sys/settings/tenant-policy',
  component: () => import('#/views/sys/tenant-policy/index.vue'),
  meta: { icon: 'lucide:sliders', title: '租户策略设置' },
},
```

```ts
// apps/server/src/app-menu/system-platform-menus.ts
{
  path: '/sys/tenant-policy',
  name: 'SysTenantPolicy',
  component: '/sys/tenant-policy/index',
  meta: { icon: 'lucide:sliders', title: '租户策略设置' },
},
```

```vue
<!-- apps/web-antd/src/views/sys/tenant-policy/index.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { sysPageSchemaApi, sysTenantApi, sysTenantPolicyApi } from '#/api/core/sys-manage';

const tenantOptions = ref<any[]>([]);
const selectedTenantId = ref<number>();
const selectedSceneCode = ref('finance.reimbursement.query');
const policyJson = ref('{}');
const previewJson = ref('{}');

async function fetchTenants() {
  const response = await sysTenantApi.getList({ page: 1, pageSize: 200 });
  tenantOptions.value = (response.items || []).map((item: any) => ({
    label: item.tenantName || `账套${item.tenantId}`,
    value: Number(item.tenantId),
  }));
  selectedTenantId.value = selectedTenantId.value || tenantOptions.value[0]?.value;
}

async function fetchPolicy() {
  if (!selectedTenantId.value) return;
  const detail = await sysTenantPolicyApi.getPolicy(selectedSceneCode.value, {
    policyType: 'pageRuntime',
    tenantId: selectedTenantId.value,
  });
  policyJson.value = JSON.stringify(JSON.parse(detail?.policyJson || '{}'), null, 2);
}

async function fetchRuntimePreview() {
  previewJson.value = JSON.stringify(
    await sysPageSchemaApi.getRuntime(selectedSceneCode.value, { tenantId: selectedTenantId.value }),
    null,
    2,
  );
}

onMounted(async () => {
  await fetchTenants();
  await fetchPolicy();
  await fetchRuntimePreview();
});
</script>
```

Also extend `apps/web-antd/src/views/sys/form-design/page-meta.vue` preview modal to show runtime `policy` and `versions.policy`:

```vue
<Descriptions.Item label="策略版本">
  {{ formatVersion(previewRuntime?.versions?.policy) }}
</Descriptions.Item>

<div class="mt-4">
  <div class="mb-2 text-sm text-gray-600">策略内容</div>
  <Input.TextArea
    :value="prettyJson(previewRuntime?.policy || {})"
    :rows="12"
    class="font-mono"
    readonly
  />
</div>
```

- [ ] **Step 4: Run the admin page test to verify it passes**

Run: `pnpm test:unit -- apps/web-antd/src/views/sys/tenant-policy/__tests__/tenant-policy-page.test.ts`

Expected: `PASS apps/web-antd/src/views/sys/tenant-policy/__tests__/tenant-policy-page.test.ts`

- [ ] **Step 5: Commit**

```bash
git add apps/web-antd/src/views/sys/tenant-policy/index.vue apps/web-antd/src/views/sys/tenant-policy/__tests__/tenant-policy-page.test.ts apps/web-antd/src/router/routes/modules/sys.ts apps/server/src/app-menu/system-platform-menus.ts apps/web-antd/src/views/sys/form-design/page-meta.vue
git commit -m "feat(policy): add tenant policy admin page"
```

## Task 7: Integrate Runtime Policy into Finance Query List

**Files:**
- Modify: `apps/web-antd/src/views/finance/_shared/FinanceQueryList.vue`
- Create: `apps/web-antd/src/views/finance/_shared/__tests__/FinanceQueryList.runtime.test.ts`

- [ ] **Step 1: Write the failing finance-query runtime test**

```ts
import { flushPromises, mount } from '@vue/test-utils';
import { ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('#/composables/useRuntimePageConfig', () => ({
  useRuntimePageConfig: () => ({
    resolveActionPolicy: (key: string) =>
      key === 'toolbar.history' ? { enabled: false, visible: false } : {},
    resolveAttachmentPolicy: () => ({}),
    resolveFieldPolicy: (key: string) =>
      key === 'search.status' ? { defaultValue: '1' } : {},
    runtime: ref({ pageName: '报销单查询' }),
    schema: ref({}),
  }),
}));

import FinanceQueryList from '../FinanceQueryList.vue';

describe('FinanceQueryList runtime policy', () => {
  it('hides the history action and applies the default status filter', async () => {
    const wrapper = mount(FinanceQueryList, {
      props: {
        description: 'desc',
        pageCode: 'finance.reimbursement.query',
        queryKey: 'reimbursement-list',
        title: 'title',
      },
    });

    await flushPromises();

    expect(wrapper.text()).not.toContain('审核历史');
    expect((wrapper.vm as any).searchParams.status).toBe('1');
  });
});
```

- [ ] **Step 2: Run the finance-query test to verify it fails**

Run: `pnpm test:unit -- apps/web-antd/src/views/finance/_shared/__tests__/FinanceQueryList.runtime.test.ts`

Expected: `FAIL` because `FinanceQueryList.vue` still imports `usePageSchema` and does not apply runtime policy defaults.

- [ ] **Step 3: Switch the page to the runtime composable**

```ts
import { useRuntimePageConfig } from '#/composables/useRuntimePageConfig';

const { runtime, schema: pageSchema, resolveActionPolicy, resolveFieldPolicy } =
  useRuntimePageConfig(
    () => props.pageCode || '',
    {
      enabled: () => !!props.pageCode,
    },
  );

watch(
  () => resolveFieldPolicy('search.status').defaultValue,
  (value) => {
    if (value !== undefined && searchParams.value.status === undefined) {
      searchParams.value.status = String(value);
    }
  },
  { immediate: true },
);

const historyToolbar = computed(() => {
  const base = resolveToolbarItem(toolbarItems.value, 'toolbar.history', '审核历史');
  const policy = resolveActionPolicy('toolbar.history');
  return {
    enabled: policy.enabled !== false,
    label: base.label,
    visible: base.visible && policy.visible !== false,
  };
});
```

Update the button binding:

```vue
<Button
  v-if="historyToolbar.visible"
  :disabled="historyToolbar.enabled === false"
  class="legacy-finance-button"
  @click="openHistory()"
>
  {{ historyToolbar.label }}
</Button>
```

- [ ] **Step 4: Run the finance-query test to verify it passes**

Run: `pnpm test:unit -- apps/web-antd/src/views/finance/_shared/__tests__/FinanceQueryList.runtime.test.ts`

Expected: `PASS apps/web-antd/src/views/finance/_shared/__tests__/FinanceQueryList.runtime.test.ts`

- [ ] **Step 5: Commit**

```bash
git add apps/web-antd/src/views/finance/_shared/FinanceQueryList.vue apps/web-antd/src/views/finance/_shared/__tests__/FinanceQueryList.runtime.test.ts
git commit -m "feat(policy): apply runtime policy to finance query list"
```

## Task 8: Integrate Runtime Policy into Income Settlement UI

**Files:**
- Modify: `apps/web-antd/src/views/finance/income-settlement/index.vue`
- Create: `apps/web-antd/src/views/finance/income-settlement/__tests__/index.runtime.test.ts`

- [ ] **Step 1: Write the failing income-settlement UI test**

```ts
import { flushPromises, mount } from '@vue/test-utils';
import { ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('#/composables/useRuntimePageConfig', () => ({
  useRuntimePageConfig: () => ({
    resolveActionPolicy: () => ({}),
    resolveAttachmentPolicy: (key: string) =>
      key === 'attachment.invoice' ? { maxCount: 2 } : {},
    resolveFieldPolicy: (key: string) => {
      if (key === 'form.basic.receiptMethod') {
        return { defaultValue: '银行转账', readonly: true };
      }
      if (key === 'form.basic.content') {
        return { required: true };
      }
      return {};
    },
    runtime: ref({ pageName: '收入结算单' }),
    schema: ref({}),
  }),
}));

import IncomeSettlementPage from '../index.vue';

describe('IncomeSettlement runtime policy', () => {
  it('applies field defaults, readonly state, and attachment limits', async () => {
    const wrapper = mount(IncomeSettlementPage);
    await flushPromises();

    expect((wrapper.vm as any).formState.receiptMethod).toBe('银行转账');
    expect(wrapper.text()).toContain('最多 2 个文件');
  });
});
```

- [ ] **Step 2: Run the income-settlement UI test to verify it fails**

Run: `pnpm test:unit -- apps/web-antd/src/views/finance/income-settlement/__tests__/index.runtime.test.ts`

Expected: `FAIL` because the page still uses `usePageSchema` only and renders fixed attachment copy.

- [ ] **Step 3: Bind field and attachment policy in the page**

```ts
import { useRuntimePageConfig } from '#/composables/useRuntimePageConfig';

const { runtime, schema: pageSchema, resolveAttachmentPolicy, resolveFieldPolicy } =
  useRuntimePageConfig('finance.income-settlement');

const receiptMethodPolicy = computed(() =>
  resolveFieldPolicy('form.basic.receiptMethod'),
);
const contentPolicy = computed(() => resolveFieldPolicy('form.basic.content'));
const invoiceAttachmentPolicy = computed(() =>
  resolveAttachmentPolicy('attachment.invoice'),
);

watch(
  () => receiptMethodPolicy.value.defaultValue,
  (value) => {
    if (value && !formState.value.receiptMethod) {
      formState.value.receiptMethod = String(value);
    }
  },
  { immediate: true },
);

function buildRequiredRule(policyKey: string, fallbackMessage: string) {
  return resolveFieldPolicy(policyKey).required
    ? [{ required: true, message: fallbackMessage }]
    : [];
}
```

Apply the policy in template bindings:

```vue
<Form.Item
  class="legacy-finance-span-3"
  label="*收款内容"
  name="content"
  :rules="buildRequiredRule('form.basic.content', '请输入收款内容')"
>
```

```vue
<Select
  v-model:value="formState.receiptMethod"
  :disabled="receiptMethodPolicy.readonly === true"
>
```

```vue
<div class="legacy-finance-hint-bar">
  上传格式为 pdf 文件，单个文件不可超过 10M，可上传
  {{ invoiceAttachmentPolicy.maxCount || 10 }} 个文件。
</div>
```

- [ ] **Step 4: Run the income-settlement UI test to verify it passes**

Run: `pnpm test:unit -- apps/web-antd/src/views/finance/income-settlement/__tests__/index.runtime.test.ts`

Expected: `PASS apps/web-antd/src/views/finance/income-settlement/__tests__/index.runtime.test.ts`

- [ ] **Step 5: Commit**

```bash
git add apps/web-antd/src/views/finance/income-settlement/index.vue apps/web-antd/src/views/finance/income-settlement/__tests__/index.runtime.test.ts
git commit -m "feat(policy): apply runtime policy to income settlement"
```

## Task 9: Integrate Runtime Policy into Invoice Folder UI

**Files:**
- Modify: `apps/web-antd/src/views/finance/invoice-folder/index.vue`
- Create: `apps/web-antd/src/views/finance/invoice-folder/__tests__/index.runtime.test.ts`

- [ ] **Step 1: Write the failing invoice-folder UI test**

```ts
import { flushPromises, mount } from '@vue/test-utils';
import { ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('#/composables/useRuntimePageConfig', () => ({
  useRuntimePageConfig: () => ({
    resolveActionPolicy: (key: string) =>
      key === 'toolbar.auth' ? { visible: false } : {},
    resolveAttachmentPolicy: () => ({}),
    resolveFieldPolicy: (key: string) =>
      key === 'form.basic.invoiceType' ? { defaultValue: '电子票据', readonly: true } : {},
    runtime: ref({ pageName: '发票夹' }),
    schema: ref({}),
  }),
}));

import InvoiceFolderPage from '../index.vue';

describe('InvoiceFolder runtime policy', () => {
  it('hides auth action and applies default invoice type', async () => {
    const wrapper = mount(InvoiceFolderPage);
    await flushPromises();

    expect(wrapper.text()).not.toContain('授权/取消授权');
    expect((wrapper.vm as any).formState.invoiceType).toBe('电子票据');
  });
});
```

- [ ] **Step 2: Run the invoice-folder UI test to verify it fails**

Run: `pnpm test:unit -- apps/web-antd/src/views/finance/invoice-folder/__tests__/index.runtime.test.ts`

Expected: `FAIL` because the page still uses `usePageSchema` only and does not apply action ceilings or field defaults.

- [ ] **Step 3: Apply action and field policies in the page**

```ts
import { useRuntimePageConfig } from '#/composables/useRuntimePageConfig';

const { runtime, schema: pageSchema, resolveActionPolicy, resolveFieldPolicy } =
  useRuntimePageConfig('finance.invoice-folder');

const authPolicy = computed(() => resolveActionPolicy('toolbar.auth'));
const invoiceTypePolicy = computed(() =>
  resolveFieldPolicy('form.basic.invoiceType'),
);

watch(
  () => invoiceTypePolicy.value.defaultValue,
  (value) => {
    if (value && !formState.value.invoiceType) {
      formState.value.invoiceType = String(value);
    }
  },
  { immediate: true },
);

const authToolbar = computed(() => {
  const base = resolveToolbarItem(toolbarItems.value, 'toolbar.auth', '授权/取消授权');
  return {
    label: base.label,
    visible: base.visible && authPolicy.value.visible !== false,
  };
});
```

Update the form control:

```vue
<Select v-model:value="formState.invoiceType" :disabled="invoiceTypePolicy.readonly === true">
  <Select.Option value="增值税电子普通发票">增值税电子普通发票</Select.Option>
  <Select.Option value="增值税专用发票">增值税专用发票</Select.Option>
  <Select.Option value="电子票据">电子票据</Select.Option>
</Select>
```

- [ ] **Step 4: Run the invoice-folder UI test to verify it passes**

Run: `pnpm test:unit -- apps/web-antd/src/views/finance/invoice-folder/__tests__/index.runtime.test.ts`

Expected: `PASS apps/web-antd/src/views/finance/invoice-folder/__tests__/index.runtime.test.ts`

- [ ] **Step 5: Commit**

```bash
git add apps/web-antd/src/views/finance/invoice-folder/index.vue apps/web-antd/src/views/finance/invoice-folder/__tests__/index.runtime.test.ts
git commit -m "feat(policy): apply runtime policy to invoice folder"
```

## Task 10: Verify End-to-End Runtime Contract and Update Docs

**Files:**
- Modify: `docs/src/riss-page-schema-runtime.md`

- [ ] **Step 1: Update the runtime documentation**

```md
## 运行态返回

运行态接口 `/sys/page-schema/runtime/:pageCode` 统一返回:

- `schema`: 标准模板 + 租户覆盖 + 个人偏好合并后的页面结构
- `policy`: 当前租户发布后的页面策略
- `context`: `tenantId`、`tenantName`、`fiscalYear`
- `sources`: 模板、覆盖、策略、偏好来源 ID
- `versions`: 模板、覆盖、策略、偏好版本号

其中个人偏好会先经过租户策略约束清洗, 不允许重新打开租户禁用动作。
```

- [ ] **Step 2: Run the backend verification suite**

Run: `pnpm -C apps/server test -- sys-tenant-policy.service.spec.ts sys-tenant-policy.runtime.spec.ts sys-page-schema.service.spec.ts income-settlement.service.spec.ts invoice-folder.service.spec.ts`

Expected: `PASS` for all five Jest specs with no skipped tests.

- [ ] **Step 3: Run the frontend verification suite**

Run: `pnpm test:unit -- apps/web-antd/src/composables/__tests__/useRuntimePageConfig.test.ts apps/web-antd/src/views/sys/tenant-policy/__tests__/tenant-policy-page.test.ts apps/web-antd/src/views/finance/_shared/__tests__/FinanceQueryList.runtime.test.ts apps/web-antd/src/views/finance/income-settlement/__tests__/index.runtime.test.ts apps/web-antd/src/views/finance/invoice-folder/__tests__/index.runtime.test.ts`

Expected: `PASS` for all five Vitest files with no alias-resolution errors.

- [ ] **Step 4: Run the focused smoke workflow**

Run: `pnpm test:smoke:riss:finance`

Expected: Successful smoke run for `/finance/reimbursement`, `/finance/payment`, and `/finance/voucher` without runtime contract regressions.

- [ ] **Step 5: Commit**

```bash
git add docs/src/riss-page-schema-runtime.md
git commit -m "docs: update runtime page schema contract"
```
