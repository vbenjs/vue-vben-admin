import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

const { getLogs, getRuntime } = vi.hoisted(() => ({
  getLogs: vi.fn().mockResolvedValue([
    {
      actionType: 'publish',
      createTime: '2026-04-07T00:00:00.000Z',
      logId: '1',
      versionNo: 3,
    },
  ]),
  getRuntime: vi.fn().mockResolvedValue({
    policy: { fields: { 'form.basic.amount': { required: true } } },
    schema: {},
    versions: { policy: 3, template: 2, tenant: 1, user: 0 },
  }),
}));

vi.mock('#/api/core/sys-manage', () => ({
  sysPageSchemaApi: {
    getRuntime,
  },
  sysTenantApi: {
    getList: vi.fn().mockResolvedValue({
      items: [{ tenantId: 7, tenantName: '华南院', status: '0' }],
    }),
  },
  sysTenantPolicyApi: {
    getLogs,
    getPolicy: vi.fn().mockResolvedValue({
      currentVersion: 0,
      policyJson: '{}',
      policyType: 'pageRuntime',
      sceneCode: 'finance.reimbursement.query',
      tenantId: 7,
    }),
    publishPolicy: vi.fn().mockResolvedValue(undefined),
    rollbackPolicy: vi.fn().mockResolvedValue(undefined),
    savePolicy: vi.fn().mockResolvedValue(undefined),
  },
}));

import TenantPolicyPage from '../index.vue';

describe('tenant policy page', () => {
  it('loads draft runtime preview and policy lifecycle logs', async () => {
    const wrapper = mount(TenantPolicyPage);
    await flushPromises();
    const pageText = wrapper.text().replace(/\s+/g, '');

    expect(pageText).toContain('租户策略设置');
    expect(pageText).toContain('华南院');
    expect(pageText).toContain('运行态预览');
    expect(pageText).toContain('版本日志');
    expect(pageText).toContain('回滚');
    expect(getRuntime).toHaveBeenCalledWith(
      'finance.reimbursement.query',
      expect.objectContaining({ mode: 'draft', tenantId: 7 }),
    );
    expect(getLogs).toHaveBeenCalledWith(
      'finance.reimbursement.query',
      expect.objectContaining({ policyType: 'pageRuntime', tenantId: 7 }),
    );
  });
});
