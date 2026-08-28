import type { App } from 'vue';

import { createApp, defineComponent, h, nextTick, ref } from 'vue';

import { afterEach, describe, expect, it } from 'vitest';

import Progress from '../Progress.vue';

let activeApp: App | undefined;

const HOST_DEFAULT_MAX = 100;

/**
 * 挂载受控 Progress，验证 reka-ui 原语暴露的 ARIA 订单与确定/不确定状态语义。
 */
async function mountProgress(
  modelValue: null | number,
  max = HOST_DEFAULT_MAX,
) {
  const value = ref(modelValue);
  const Consumer = defineComponent(
    () => () =>
      h(Progress, {
        max,
        modelValue: value.value,
      }),
  );
  const host = document.createElement('div');
  document.body.append(host);
  activeApp = createApp(Consumer);
  activeApp.mount(host);
  await nextTick();

  const root = host.querySelector('[data-slot="progress"]');
  const indicator = host.querySelector('[data-slot="progress-indicator"]');

  return { indicator, root, value };
}

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
});

describe('vben progress', () => {
  it('renders progressbar semantics with bounded value', async () => {
    const { root } = await mountProgress(42);

    expect(root).toBeInstanceOf(HTMLElement);
    if (!(root instanceof HTMLElement)) return;
    expect(root.getAttribute('role')).toBe('progressbar');
    expect(root.getAttribute('aria-valuemin')).toBe('0');
    expect(root.getAttribute('aria-valuemax')).toBe('100');
    expect(root.getAttribute('aria-valuenow')).toBe('42');
  });

  it('respects a custom max when reporting value', async () => {
    const { indicator, root } = await mountProgress(30, 50);

    expect(root).toBeInstanceOf(HTMLElement);
    if (!(root instanceof HTMLElement)) return;
    expect(root.getAttribute('aria-valuemax')).toBe('50');
    expect(root.getAttribute('aria-valuenow')).toBe('30');

    // 30 / 50 应按自定义 max 归一化为 60%，而不是 30%。
    expect(indicator).toBeInstanceOf(HTMLElement);
    if (!(indicator instanceof HTMLElement)) return;
    expect(indicator.style.transform).toBe('translateX(-40%)');
  });

  it.each([
    ['NaN', Number.NaN],
    ['infinite', Number.POSITIVE_INFINITY],
  ])('falls back to max 100 when a %s max is provided', async (_label, max) => {
    const { indicator, root } = await mountProgress(30, max);

    expect(root).toBeInstanceOf(HTMLElement);
    if (!(root instanceof HTMLElement)) return;
    expect(root.getAttribute('aria-valuemax')).toBe('100');

    // 非有限 max 不得产生无穷 transform：30 / 100 → 30% 填充。
    expect(indicator).toBeInstanceOf(HTMLElement);
    if (!(indicator instanceof HTMLElement)) return;
    expect(indicator.style.transform).toBe('translateX(-70%)');
  });

  it('omits aria-valuenow and marks indeterminate state when value is null', async () => {
    const { root } = await mountProgress(null);

    expect(root).toBeInstanceOf(HTMLElement);
    if (!(root instanceof HTMLElement)) return;
    expect(root.getAttribute('role')).toBe('progressbar');
    expect(root.getAttribute('aria-valuenow')).toBeNull();
    expect(root.getAttribute('data-state')).toBe('indeterminate');
  });

  it('hides the indicator fill when value is zero', async () => {
    const { indicator } = await mountProgress(0);

    expect(indicator).toBeInstanceOf(HTMLElement);
    if (!(indicator instanceof HTMLElement)) return;
    expect(indicator.style.transform).toBe('translateX(-100%)');
  });
});
