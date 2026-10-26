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
  trigger!.click();
  await nextTick();
  await vi.waitFor(() => {
    expect(
      document.body.querySelector('[data-slot="popover-content"]'),
    ).toBeTruthy();
  });

  const content = document.body.querySelector('[data-slot="popover-content"]')!;
  const buttons = [...content.querySelectorAll('button')];

  return { buttons, content };
}

/** 提取与尺寸相关的类名，用于比较两个按钮的视觉大小是否一致 */
function sizeClasses(element: Element) {
  return [...element.classList]
    .filter((name) => /^(h-\d+|p-\d+|px-\d+|py-\d+)$/.test(name))
    .sort();
}

describe('action-item.vue popConfirm', () => {
  it('renders the default confirmation texts with the locale messages', async () => {
    setSimpleLocale('zh-CN');

    const { buttons, content } = await openPopConfirm({
      danger: true,
      popConfirm: {},
      text: '删除',
    });

    const [cancelButton, confirmButton] = buttons;
    expect(content.textContent).toContain('请确认');
    expect(cancelButton.textContent?.trim()).toBe('取消');
    expect(confirmButton.textContent?.trim()).toBe('确认');
    // 不应出现硬编码的英文文案
    expect(content.textContent).not.toContain('Are you sure?');
    expect(content.textContent).not.toContain('OK');
  });

  it('renders the default confirmation texts in english locale', async () => {
    setSimpleLocale('en-US');

    const { buttons, content } = await openPopConfirm({
      danger: true,
      popConfirm: {},
      text: 'Delete',
    });

    const [cancelButton, confirmButton] = buttons;
    expect(content.textContent).toContain('Please Confirm');
    expect(cancelButton.textContent?.trim()).toBe('Cancel');
    expect(confirmButton.textContent?.trim()).toBe('Confirm');
    expect(content.textContent).not.toContain('Are you sure?');
    expect(content.textContent).not.toContain('OK');
  });

  it('keeps the custom confirmation texts', async () => {
    setSimpleLocale('zh-CN');

    const { buttons, content } = await openPopConfirm({
      danger: true,
      popConfirm: {
        cancelText: '再想想',
        okText: '删除吧',
        title: '确认删除?',
      },
      text: '删除',
    });

    const [cancelButton, confirmButton] = buttons;
    expect(content.textContent).toContain('确认删除?');
    expect(cancelButton.textContent?.trim()).toBe('再想想');
    expect(confirmButton.textContent?.trim()).toBe('删除吧');
  });

  it('renders the cancel and confirm buttons with the same size', async () => {
    setSimpleLocale('zh-CN');

    const { buttons } = await openPopConfirm({
      danger: true,
      popConfirm: {},
      text: '删除',
    });

    expect(buttons).toHaveLength(2);
    const [cancelButton, confirmButton] = buttons;
    expect(sizeClasses(cancelButton)).toEqual(sizeClasses(confirmButton));
  });
});
