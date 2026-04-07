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

type RuntimePageConfigVm = {
  resolveActionPolicy: (key: string) => Record<string, any>;
  resolveAttachmentPolicy: (key: string) => Record<string, any>;
  resolveFieldPolicy: (key: string) => Record<string, any>;
  versions: Record<string, any>;
};

describe('useRuntimePageConfig', () => {
  it('exposes field, action, and attachment policy helpers', async () => {
    const wrapper = mount({
      setup() {
        return useRuntimePageConfig('finance.reimbursement.query');
      },
      template: '<div />',
    });

    await flushPromises();
    const vm = wrapper.vm as unknown as RuntimePageConfigVm;

    expect(vm.resolveFieldPolicy('search.status')).toMatchObject({
      defaultValue: '1',
    });
    expect(vm.resolveActionPolicy('toolbar.history')).toMatchObject({
      enabled: false,
      visible: false,
    });
    expect(vm.resolveAttachmentPolicy('attachment.invoice')).toMatchObject({
      maxCount: 2,
    });
    expect(vm.versions.policy).toBe(4);
  });
});
