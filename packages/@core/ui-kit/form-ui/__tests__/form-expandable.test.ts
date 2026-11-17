import type { FormRenderProps } from '../src/types';

import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, reactive } from 'vue';

import { afterEach, expect, it, vi } from 'vitest';

import { useExpandable } from '../src/form-render/expandable';

afterEach(() => vi.restoreAllMocks());

it('counts grid gaps and recalculates when collapsedRows changes', async () => {
  const props = reactive<FormRenderProps>({
    collapsedRows: 2,
    // 此用例直接渲染几何节点,不实例化字段组件。
    componentMap: {} as FormRenderProps['componentMap'],
    schema: [],
    showCollapseButton: true,
  });
  const getRect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
  getRect.mockImplementation(function (this: HTMLElement) {
    const top = Number(this.dataset.row ?? 0) * 82;
    return { top, bottom: top + 34, height: 34 } as DOMRect;
  });
  const state: { expandable?: ReturnType<typeof useExpandable> } = {};
  const Harness = defineComponent({
    setup() {
      state.expandable = useExpandable(props);
      return () =>
        h(
          'div',
          {
            ref: 'wrapperRef',
            style: {
              display: 'grid',
              gridTemplateRows: '34px 34px 34px 34px',
              rowGap: '48px',
            },
          },
          Array.from({ length: 8 }, (_, index) =>
            h('div', { 'data-row': Math.floor(index / 2) }),
          ),
        );
    },
  });
  const wrapper = mount(Harness, { attachTo: document.body });
  try {
    await flushPromises();
    // 两列、两行,保留三个字段和一个操作区。
    expect(state.expandable?.keepFormItemIndex.value).toBe(3);
    props.collapsedRows = 3;
    await flushPromises();
    expect(state.expandable?.keepFormItemIndex.value).toBe(5);
  } finally {
    wrapper.unmount();
  }
});
