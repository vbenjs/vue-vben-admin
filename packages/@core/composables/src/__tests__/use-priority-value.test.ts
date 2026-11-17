import type { App } from 'vue';

import { createApp, defineComponent, h, nextTick, ref } from 'vue';

import { afterEach, describe, expect, it } from 'vitest';

import { usePriorityValue } from '../use-priority-value';

let activeApp: App | undefined;

function mountPriority(
  initialProps: Record<string, any>,
  stateValue?: Record<string, any>,
) {
  const result: Record<string, any> = {};
  const state = stateValue ? ref(stateValue) : undefined;

  const Consumer = defineComponent(
    (props: Record<string, any>) => {
      result.sectionOptions = usePriorityValue(
        'sectionOptions',
        props as any,
        state as any,
      );
      return () => h('div');
    },
    { props: ['sectionOptions'] },
  );

  const host = document.createElement('div');
  document.body.append(host);

  const root = defineComponent({
    setup() {
      return () => h(Consumer, { ...initialProps });
    },
  });
  activeApp = createApp(root);
  activeApp.mount(host);

  return { host, result, root };
}

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
});

describe('usePriorityValue', () => {
  it('prefers props over state when the prop is present', async () => {
    const { result } = mountPriority(
      { sectionOptions: { from: 'props' } },
      { sectionOptions: { from: 'state' } },
    );
    expect(result.sectionOptions.value).toEqual({ from: 'props' });
  });

  it('falls back to state when the prop is absent', async () => {
    const { result } = mountPriority({}, { sectionOptions: { from: 'state' } });
    expect(result.sectionOptions.value).toEqual({ from: 'state' });
  });

  it('tracks props that are initially undefined and later provided', async () => {
    const props = ref<Record<string, any>>({});
    const result: Record<string, any> = {};

    const Consumer = defineComponent(
      (props: Record<string, any>) => {
        result.sectionOptions = usePriorityValue(
          'sectionOptions',
          props as any,
          undefined,
        );
        return () => h('div');
      },
      { props: ['sectionOptions'] },
    );

    const host = document.createElement('div');
    document.body.append(host);
    const app = createApp(
      defineComponent(() => () => h(Consumer, { ...props.value })),
    );
    activeApp = app;
    app.mount(host);

    expect(result.sectionOptions.value).toBeUndefined();

    // 初始未传入的 prop 后续传入时,computed 必须重新求值(回归:依赖缺失)
    props.value = { sectionOptions: { gap: '12px' } };
    await nextTick();
    await nextTick();
    expect(result.sectionOptions.value).toEqual({ gap: '12px' });
  });
});
