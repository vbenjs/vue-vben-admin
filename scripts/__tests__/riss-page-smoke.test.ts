import { describe, expect, it, vi } from 'vitest';

import { inspectTargets } from '../riss-page-smoke-lib.mjs';

describe('inspectTargets', () => {
  it('uses a fresh page for each target and closes it after inspection', async () => {
    const page1 = {
      close: vi.fn().mockResolvedValue(undefined),
    };
    const page2 = {
      close: vi.fn().mockResolvedValue(undefined),
    };
    const context = {
      newPage: vi
        .fn()
        .mockResolvedValueOnce(page1)
        .mockResolvedValueOnce(page2),
    };
    const targets = [
      { path: '/finance/reimbursement', requiredTexts: ['报销单查询'] },
      { path: '/finance/payment', requiredTexts: ['支付单查询'] },
    ];
    const inspectPage = vi
      .fn()
      .mockResolvedValueOnce({ failed: false, path: targets[0].path })
      .mockResolvedValueOnce({ failed: false, path: targets[1].path });

    const results = await inspectTargets(
      context as any,
      targets as any,
      inspectPage as any,
    );

    expect(context.newPage).toHaveBeenCalledTimes(2);
    expect(inspectPage).toHaveBeenNthCalledWith(1, page1, targets[0]);
    expect(inspectPage).toHaveBeenNthCalledWith(2, page2, targets[1]);
    expect(page1.close).toHaveBeenCalledTimes(1);
    expect(page2.close).toHaveBeenCalledTimes(1);
    expect(results).toEqual([
      { failed: false, path: '/finance/reimbursement' },
      { failed: false, path: '/finance/payment' },
    ]);
  });
});
