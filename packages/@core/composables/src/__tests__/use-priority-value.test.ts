import type { App } from 'vue';

import { createApp, defineComponent, h, nextTick, ref, useAttrs } from 'vue';

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

  it('tracks presence transitions of falsy values on undeclared (attrs-based) components', async () => {
    // vxe-grid 等包装组件无运行时 props 声明,通过 useAttrs 获取透传属性:
    // undefined → false → 值 → undefined 的 presence 转换必须全部触发
    const props = ref<Record<string, any>>({ separator: undefined });
    const result: Record<string, any> = {};

    const Consumer = defineComponent(() => {
      result.separator = usePriorityValue(
        'separator',
        useAttrs() as any,
        ref({ separator: true }) as any,
      );
      return () => h('div');
    });

    const host = document.createElement('div');
    document.body.append(host);
    const app = createApp(
      defineComponent(() => () => h(Consumer, { ...props.value })),
    );
    activeApp = app;
    app.mount(host);

    // absent(undefined) → state fallback true
    expect(result.separator.value).toBe(true);

    // undefined → false:显式 false 是有效值,不得回落到 state
    props.value = { separator: false };
    await nextTick();
    await nextTick();
    expect(result.separator.value).toBe(false);

    // false → true
    props.value = { separator: true };
    await nextTick();
    await nextTick();
    expect(result.separator.value).toBe(true);

    // true → absent:回到 state fallback
    props.value = {};
    await nextTick();
    await nextTick();
    expect(result.separator.value).toBe(true);
  });

  it('tracks value changes on withDefaults-declared boolean props', async () => {
    // withDefaults 模式(drawer/modal 等):resolved 值变化必须触发。
    // 已知限制:声明 Boolean 的 prop 在 Vue 中 absent 与显式 false 的
    // resolved 值同为 false,presence-only 更新(如 false→false)无法
    // 触发任何 computed——这是框架层面无 reactive presence 信号所致
    const props = ref<Record<string, any>>({});
    const result: Record<string, any> = {};

    const Consumer = defineComponent(
      (props: Record<string, any>) => {
        result.submitting = usePriorityValue(
          'submitting',
          props as any,
          ref({ submitting: false }) as any,
        );
        return () => h('div');
      },
      { props: { submitting: { type: Boolean, default: undefined } } },
    );

    const host = document.createElement('div');
    document.body.append(host);
    const app = createApp(
      defineComponent(() => () => h(Consumer, { ...props.value })),
    );
    activeApp = app;
    app.mount(host);

    // absent(default: undefined 禁用 boolean cast)→ state fallback false
    expect(result.submitting.value).toBe(false);

    // absent → false:resolved undefined → false,可触发
    props.value = { submitting: false };
    await nextTick();
    await nextTick();
    expect(result.submitting.value).toBe(false);

    // false → true
    props.value = { submitting: true };
    await nextTick();
    await nextTick();
    expect(result.submitting.value).toBe(true);

    // true → absent:resolved 回到 undefined(default)→ state fallback
    props.value = {};
    await nextTick();
    await nextTick();
    expect(result.submitting.value).toBe(false);
  });
});
