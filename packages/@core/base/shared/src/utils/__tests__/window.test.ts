import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { openRouteInNewWindow, openWindow } from '../window';

describe('openWindow', () => {
  // 保存原始的 window.open 函数
  let originalOpen: typeof window.open;

  beforeEach(() => {
    originalOpen = window.open;
  });

  afterEach(() => {
    window.open = originalOpen;
  });

  it('should call window.open with correct arguments', () => {
    const url = 'https://example.com';
    const options = { noopener: true, noreferrer: true, target: '_blank' };

    window.open = vi.fn();

    // 调用函数
    openWindow(url, options);

    // 验证 window.open 是否被正确地调用
    expect(window.open).toHaveBeenCalledWith(
      url,
      options.target,
      'noopener=yes,noreferrer=yes',
    );
  });
});

describe('openRouteInNewWindow', () => {
  let originalOpen: typeof window.open;

  beforeEach(() => {
    originalOpen = window.open;
    window.open = vi.fn();
  });

  afterEach(() => {
    window.open = originalOpen;
    vi.unstubAllGlobals();
  });

  const stubLocation = (href: string) => {
    const url = new URL(href);
    vi.stubGlobal('location', {
      hash: url.hash,
      href: url.href,
      origin: url.origin,
      pathname: url.pathname,
      search: url.search,
    });
  };

  const openedUrl = () => vi.mocked(window.open).mock.calls[0]?.[0];

  it('keeps the deployment base when the app runs in hash mode', () => {
    stubLocation('https://demo.com/myapp/#/dashboard');

    openRouteInNewWindow('/myapp/#/demo');

    expect(openedUrl()).toBe('https://demo.com/myapp/#/demo');
  });

  it('uses an already resolved hash href as is at the root base', () => {
    stubLocation('https://demo.com/#/dashboard');

    openRouteInNewWindow('/#/demo');

    expect(openedUrl()).toBe('https://demo.com/#/demo');
  });

  it('opens a plain route path in hash mode', () => {
    stubLocation('https://demo.com/#/dashboard');

    openRouteInNewWindow('/demo');

    expect(openedUrl()).toBe('https://demo.com/#/demo');
  });

  it('keeps the deployment base in history mode', () => {
    stubLocation('https://demo.com/myapp/dashboard');

    openRouteInNewWindow('/myapp/demo');

    expect(openedUrl()).toBe('https://demo.com/myapp/demo');
  });
});
