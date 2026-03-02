import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loadScript } from '../resources';

describe('loadScript', () => {
  beforeEach(() => {
    // 每个测试前清空 head，保证环境干净
    document.head.innerHTML = '';
  });

  it('should resolve when the script loads successfully', async () => {
    // happy-dom v20+ auto-fires 'load' via handleDisabledFileLoadingAsSuccess
    const promise = loadScript('/test-script.js');

    const script = document.querySelector(
      'script[src="/test-script.js"]',
    ) as HTMLScriptElement;
    expect(script).toBeTruthy();

    await expect(promise).resolves.toBeUndefined();
  });

  it('should not insert duplicate script and resolve immediately if already loaded', async () => {
    // 先手动插入一个相同 src 的 script
    const existing = document.createElement('script');
    existing.src = 'bar.js';
    document.head.append(existing);

    // 再次调用
    const promise = loadScript('bar.js');

    // 立即 resolve
    await expect(promise).resolves.toBeUndefined();

    // head 中只保留一个
    const scripts = document.head.querySelectorAll('script[src="bar.js"]');
    expect(scripts).toHaveLength(1);
  });

  it('should reject when the script fails to load', async () => {
    let capturedScript: HTMLScriptElement | null = null;

    // 拦截 append，捕获 script 元素但不插入 DOM，
    // 防止 happy-dom v20+ 自动触发 load 事件
    const appendSpy = vi
      .spyOn(document.head, 'append')
      .mockImplementation((...nodes) => {
        for (const node of nodes) {
          if (node instanceof HTMLScriptElement) {
            capturedScript = node;
          }
        }
      });

    const promise = loadScript('error.js');

    appendSpy.mockRestore();

    expect(capturedScript).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    capturedScript!.dispatchEvent(new Event('error'));

    await expect(promise).rejects.toThrow('Failed to load script: error.js');
  });

  it('should handle multiple concurrent calls and only insert one script tag', async () => {
    const p1 = loadScript('/test-script.js');
    const p2 = loadScript('/test-script.js');

    // happy-dom v20+ auto-fires 'load'，两个 promise 都应该 resolve
    await expect(p1).resolves.toBeUndefined();
    await expect(p2).resolves.toBeUndefined();

    // 只插入一次
    const scripts = document.head.querySelectorAll(
      'script[src="/test-script.js"]',
    );
    expect(scripts).toHaveLength(1);
  });
});
