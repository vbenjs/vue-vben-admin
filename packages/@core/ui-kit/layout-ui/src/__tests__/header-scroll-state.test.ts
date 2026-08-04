import { describe, expect, it } from 'vitest';

import { resolveHeaderHiddenOnScroll } from '../header-scroll-state';

const baseOptions = {
  arrivedTop: false,
  currentHidden: false,
  directionDown: false,
  directionUp: false,
  headerHeight: 90,
  scrollTop: 120,
};

describe('resolveHeaderHiddenOnScroll', () => {
  it('should show the header near the top', () => {
    expect(
      resolveHeaderHiddenOnScroll({
        ...baseOptions,
        directionDown: true,
        scrollTop: 89,
      }),
    ).toBe(false);
  });

  it('should show the header when the top is reached', () => {
    expect(
      resolveHeaderHiddenOnScroll({
        ...baseOptions,
        arrivedTop: true,
        currentHidden: true,
      }),
    ).toBe(false);
  });

  it('should show the header while scrolling up', () => {
    expect(
      resolveHeaderHiddenOnScroll({
        ...baseOptions,
        currentHidden: true,
        directionUp: true,
      }),
    ).toBe(false);
  });

  it('should hide the header while scrolling down', () => {
    expect(
      resolveHeaderHiddenOnScroll({
        ...baseOptions,
        directionDown: true,
      }),
    ).toBe(true);
  });

  it('should preserve the current state without a direction', () => {
    expect(
      resolveHeaderHiddenOnScroll({
        ...baseOptions,
        currentHidden: true,
      }),
    ).toBe(true);
  });
});
