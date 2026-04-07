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

vi.mock('../legacy-finance', () => ({
  fetchLegacyFinanceList: vi.fn().mockResolvedValue({
    items: [],
    total: 0,
  }),
}));

vi.mock('../../../sys/_shared/workbench-command', () => ({
  fetchWorkflowHistory: vi.fn().mockResolvedValue([]),
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
