import { createApp, h, nextTick } from 'vue';

import { useSimpleLocale } from '@vben-core/composables';

import { afterEach, describe, expect, it, vi } from 'vitest';

import ActionItem from '../action-item.vue';

const { setSimpleLocale } = useSimpleLocale();

let activeApp: ReturnType<typeof createApp> | undefined;

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
  setSimpleLocale('zh-CN');
});

async function openPopConfirm(action: Record<string, any>) {
  const host = document.createElement('div');
  document.body.append(host);

  activeApp = createApp(() => h(ActionItem, { action }));
  activeApp.mount(host);
  await nextTick();

  const trigger = host.querySelector('button');
  expect(trigger).toBeTruthy();
  trigger?.click();
  await nextTick();
  await vi.waitFor(() => {
    expect(
      document.body.querySelector('[data-slot="popover-content"]'),
    ).toBeTruthy();
  });

  const content = document.body.querySelector('[data-slot="popover-content"]');
  expect(content).toBeTruthy();
  if (!content) {
    throw new Error('Expected popover content to exist');
  }
  const [cancelButton, confirmButton] = [...content.querySelectorAll('button')];
  expect(cancelButton).toBeTruthy();
  expect(confirmButton).toBeTruthy();
  if (!cancelButton || !confirmButton) {
    throw new Error('Expected cancel and confirm buttons to exist');
  }

  return { cancelButton, confirmButton, content };
}

/** 提取与尺寸相关的类名，用于比较两个按钮的视觉大小是否一致 */
function sizeClasses(element: Element) {
  return [...element.classList]
    .filter((name) => /^(h-\d+|p-\d+|px-\d+|py-\d+)$/.test(name))
    .toSorted();
}

describe('action-item.vue popConfirm', () => {
  it('renders the default confirmation texts with the locale messages', async () => {
    setSimpleLocale('zh-CN');

    const { cancelButton, confirmButton, content } = await openPopConfirm({
      danger: true,
      popConfirm: {},
      text: '删除',
    });

    expect(content.textContent).toContain('请确认');
    expect(cancelButton.textContent?.trim()).toBe('取消');
    expect(confirmButton.textContent?.trim()).toBe('确认');
    // 不应出现硬编码的英文文案
    expect(content.textContent).not.toContain('Are you sure?');
    expect(content.textContent).not.toContain('OK');
  });

  it('renders the default confirmation texts in english locale', async () => {
    setSimpleLocale('en-US');

    const { cancelButton, confirmButton, content } = await openPopConfirm({
      danger: true,
      popConfirm: {},
      text: 'Delete',
    });

    expect(content.textContent).toContain('Please Confirm');
    expect(cancelButton.textContent?.trim()).toBe('Cancel');
    expect(confirmButton.textContent?.trim()).toBe('Confirm');
    expect(content.textContent).not.toContain('Are you sure?');
    expect(content.textContent).not.toContain('OK');
  });

  it('keeps the custom confirmation texts', async () => {
    setSimpleLocale('zh-CN');

    const { cancelButton, confirmButton, content } = await openPopConfirm({
      danger: true,
      popConfirm: {
        cancelText: '再想想',
        okText: '删除吧',
        title: '确认删除?',
      },
      text: '删除',
    });

    expect(content.textContent).toContain('确认删除?');
    expect(cancelButton.textContent?.trim()).toBe('再想想');
    expect(confirmButton.textContent?.trim()).toBe('删除吧');
  });

  it('renders the cancel and confirm buttons with the same size', async () => {
    setSimpleLocale('zh-CN');

    const { cancelButton, confirmButton, content } = await openPopConfirm({
      danger: true,
      popConfirm: {},
      text: '删除',
    });

    expect(content.querySelectorAll('button')).toHaveLength(2);
    expect(sizeClasses(cancelButton)).toEqual(sizeClasses(confirmButton));
  });

  it('renders the confirmation buttons with the same size as the dropdown pop confirm', async () => {
    setSimpleLocale('zh-CN');

    const { cancelButton, confirmButton } = await openPopConfirm({
      danger: true,
      popConfirm: {},
      text: '删除',
    });

    // 与 action-dropdown-item.vue 的气泡确认一致，使用 sm 尺寸
    expect(cancelButton.classList).toContain('h-8');
    expect(confirmButton.classList).toContain('h-8');
  });
});

describe('action-item.vue trigger button', () => {
  it.each([
    ['pop confirm', { popConfirm: {}, text: '删除' }],
    ['plain', { text: '编辑' }],
  ])(
    'does not add vertical padding to the %s button (#8461)',
    async (_, action) => {
      const host = document.createElement('div');
      document.body.append(host);

      activeApp = createApp(() => h(ActionItem, { action }));
      activeApp.mount(host);
      await nextTick();

      const button = host.querySelector('button');
      expect(button).toBeTruthy();
      expect(button?.classList).toContain('py-0');
      expect(button?.classList).not.toContain('p-2');
      expect(button?.classList).not.toContain('py-2');
    },
  );
});
