import { computed, nextTick } from 'vue';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { alert, clearAllAlerts, confirm } from '../index';

vi.mock('@vben-core/composables', () => {
  // Alert 组件内部使用函数调用 $t(key)，AlertBuilder 使用 $t.value(key)，
  // 因此同时支持两种调用方式。
  const $t = Object.assign((key: string) => key, {
    value: (key: string) => key,
  });
  return {
    useScrollLock: () =>
      computed({
        get: () => false,
        set: () => {},
      }),
    useSimpleLocale: () => ({ $t }),
  };
});

vi.mock('@vben-core/preferences', () => ({
  usePreferences: () => ({
    globalEscapeShortcutKey: { value: true },
  }),
}));

/**
 * 在当前 document 中查找文案匹配的按钮。
 */
function findButtonByText(text: string) {
  return [...document.querySelectorAll('button')].find(
    (element) => element.textContent?.trim() === text,
  );
}

/**
 * 查找 AlertBuilder 挂载到 body 的容器元素（其内容包含指定文案）。
 */
function findAlertContainer(content: string) {
  return [...document.body.children].find((element) =>
    element.textContent?.includes(content),
  );
}

afterEach(() => {
  clearAllAlerts();
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('imperative alert builder (AlertBuilder)', () => {
  it('resolves the promise when the confirm button is clicked on an imperative alert()', async () => {
    const promise = alert({
      content: 'Alert content',
      confirmText: 'Confirm',
    });
    await nextTick();
    await nextTick();

    const button = findButtonByText('Confirm');
    expect(button).toBeInstanceOf(HTMLElement);
    if (!(button instanceof HTMLElement)) return;
    const container = findAlertContainer('Alert content');
    expect(container).toBeInstanceOf(HTMLElement);
    if (!container) return;

    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await expect(promise).resolves.toBeUndefined();
    await nextTick();

    // 容器与按钮应从 DOM 中移除，页面恢复到调用前的状态。
    expect(findButtonByText('Confirm')).toBeUndefined();
    expect(document.body.contains(container)).toBe(false);
  });

  it('rejects with dialog cancelled when the cancel button is clicked on an imperative confirm()', async () => {
    const promise = confirm({
      content: 'Confirm content',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
    });
    await nextTick();
    await nextTick();

    const cancelButton = findButtonByText('Cancel');
    expect(cancelButton).toBeInstanceOf(HTMLElement);
    if (!(cancelButton instanceof HTMLElement)) return;
    const container = findAlertContainer('Confirm content');
    expect(container).toBeInstanceOf(HTMLElement);
    if (!container) return;

    cancelButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await expect(promise).rejects.toThrow('dialog cancelled');
    await nextTick();

    // 容器与按钮应从 DOM 中移除。
    expect(findButtonByText('Cancel')).toBeUndefined();
    expect(document.body.contains(container)).toBe(false);
  });

  it('rejects with dialog cancelled when Escape is pressed on an imperative alert()', async () => {
    const promise = alert({
      content: 'Alert content',
      confirmText: 'Confirm',
    });
    await nextTick();
    await nextTick();

    const container = findAlertContainer('Alert content');
    expect(container).toBeInstanceOf(HTMLElement);
    if (!container) return;

    document.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }),
    );
    await expect(promise).rejects.toThrow('dialog cancelled');
    await nextTick();

    expect(findButtonByText('Confirm')).toBeUndefined();
    expect(document.body.contains(container)).toBe(false);
  });

  it('removes every mounted container when clearAllAlerts is called', async () => {
    alert({ content: 'First alert', confirmText: 'First confirm' });
    alert({ content: 'Second alert', confirmText: 'Second confirm' });
    await nextTick();
    await nextTick();

    expect(findButtonByText('First confirm')).toBeInstanceOf(HTMLElement);
    expect(findButtonByText('Second confirm')).toBeInstanceOf(HTMLElement);
    const firstContainer = findAlertContainer('First alert');
    const secondContainer = findAlertContainer('Second alert');
    expect(firstContainer).toBeInstanceOf(HTMLElement);
    expect(secondContainer).toBeInstanceOf(HTMLElement);
    if (!firstContainer || !secondContainer) return;

    clearAllAlerts();
    await nextTick();

    expect(findButtonByText('First confirm')).toBeUndefined();
    expect(findButtonByText('Second confirm')).toBeUndefined();
    expect(document.body.contains(firstContainer)).toBe(false);
    expect(document.body.contains(secondContainer)).toBe(false);
  });
});
