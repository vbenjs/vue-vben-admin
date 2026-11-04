import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { downloadFileFromUrl } from '../download';

describe('downloadFileFromUrl', () => {
  let clicked: string[] = [];
  const originalUserAgent = window.navigator.userAgent;

  function useChromeUserAgent() {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
  }

  beforeEach(() => {
    clicked = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(
      function mockClick(this: HTMLAnchorElement) {
        clicked.push(this.download);
      },
    );
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: originalUserAgent,
    });
  });

  it('derives a decoded file name without the query string', async () => {
    useChromeUserAgent();

    await downloadFileFromUrl({
      source: 'https://cdn.example.com/files/%E6%8A%A5%E5%91%8A.pdf?token=abc',
    });

    expect(clicked).toEqual(['报告.pdf']);
  });

  it('keeps a plain file name and honours an explicit one', async () => {
    useChromeUserAgent();

    await downloadFileFromUrl({
      source: 'https://cdn.example.com/files/report.pdf',
    });
    await downloadFileFromUrl({
      fileName: 'custom.pdf',
      source: 'https://cdn.example.com/files/report.pdf?v=2',
    });

    expect(clicked).toEqual(['report.pdf', 'custom.pdf']);
  });
});
