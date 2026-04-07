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

vi.mock('#/composables/usePageSchema', async () => {
  const actual = await vi.importActual<any>('#/composables/usePageSchema');
  return {
    ...actual,
    usePageSchema: () => ({
      loading: ref(false),
      refresh: vi.fn(),
      runtime: ref({ pageName: '收入结算单' }),
      schema: ref({}),
    }),
  };
});

vi.mock('#/api/core/finance', () => ({
  incomeSettlementApi: {
    getList: vi.fn().mockResolvedValue({ items: [], total: 0 }),
  },
  invoiceFolderApi: {
    getList: vi.fn().mockResolvedValue({ items: [], total: 0 }),
  },
}));

import IncomeSettlementPage from '../index.vue';

describe('IncomeSettlement runtime policy', () => {
  it('applies field defaults, readonly state, and attachment limits', async () => {
    const wrapper = mount(IncomeSettlementPage, {
      global: {
        stubs: {
          Page: { template: '<div><slot /></div>' },
          teleport: true,
        },
      },
    });
    await flushPromises();
    await (wrapper.vm as any).openModal();
    await flushPromises();

    expect((wrapper.vm as any).formState.receiptMethod).toBe('银行转账');
    expect(wrapper.text()).toContain('最多 2 个文件');
  });
});
