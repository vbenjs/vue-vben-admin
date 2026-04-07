import { flushPromises, mount } from '@vue/test-utils';
import { ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('#/composables/useRuntimePageConfig', () => ({
  useRuntimePageConfig: () => ({
    resolveActionPolicy: (key: string) =>
      key === 'toolbar.auth' ? { visible: false } : {},
    resolveAttachmentPolicy: () => ({}),
    resolveFieldPolicy: (key: string) =>
      key === 'form.basic.invoiceType'
        ? { defaultValue: '电子票据', readonly: true }
        : {},
    runtime: ref({ pageName: '发票夹' }),
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
      runtime: ref({ pageName: '发票夹' }),
      schema: ref({}),
    }),
  };
});

vi.mock('#/api/core/finance', () => ({
  invoiceFolderApi: {
    getList: vi.fn().mockResolvedValue({ items: [], total: 0 }),
  },
}));

import InvoiceFolderPage from '../index.vue';

describe('InvoiceFolder runtime policy', () => {
  it('hides auth action and applies default invoice type', async () => {
    const wrapper = mount(InvoiceFolderPage, {
      global: {
        stubs: {
          Page: { template: '<div><slot /></div>' },
          teleport: true,
        },
      },
    });
    await flushPromises();

    expect(wrapper.text()).not.toContain('授权/取消授权');
    expect((wrapper.vm as any).formState.invoiceType).toBe('电子票据');
  });
});
