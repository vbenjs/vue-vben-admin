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
