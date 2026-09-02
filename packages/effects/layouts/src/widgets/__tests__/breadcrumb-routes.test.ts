import type { RouteLocationMatched } from 'vue-router';

import { describe, expect, it, vi } from 'vitest';

import { resolveBreadcrumbMatches } from '../breadcrumb-routes';

function createMatch(
  name: RouteLocationMatched['name'],
  path: string,
): RouteLocationMatched {
  return { name, path } as RouteLocationMatched;
}

describe('resolveBreadcrumbMatches', () => {
  it('preserves the current matches when activePath breadcrumbs are disabled', () => {
    const matches = [createMatch('Detail', '/detail')];
    const resolveRoute = vi.fn();

    expect(
      resolveBreadcrumbMatches(
        {
          matched: matches,
          meta: {
            activePath: '/list',
            breadcrumbUseActivePath: false,
            title: 'Detail',
          },
        },
        resolveRoute,
      ),
    ).toBe(matches);
    expect(resolveRoute).not.toHaveBeenCalled();
  });

  it('preserves the current matches when activePath cannot be resolved', () => {
    const matches = [createMatch('Detail', '/detail')];

    expect(
      resolveBreadcrumbMatches(
        {
          matched: matches,
          meta: {
            activePath: '/missing',
            breadcrumbUseActivePath: true,
            title: 'Detail',
          },
        },
        () => ({ matched: [] }),
      ),
    ).toBe(matches);
  });

  it('prepends activePath matches and removes duplicate route records', () => {
    const root = createMatch('Root', '/');
    const list = createMatch('List', '/list');
    const detail = createMatch('Detail', '/detail');

    expect(
      resolveBreadcrumbMatches(
        {
          matched: [root, detail],
          meta: {
            activePath: '/list',
            breadcrumbUseActivePath: true,
            title: 'Detail',
          },
        },
        () => ({ matched: [root, list] }),
      ),
    ).toEqual([root, list, detail]);
  });

  it('keeps distinct unnamed matches with the same normalized path', () => {
    const parent = createMatch(undefined, '/list');
    const defaultChild = createMatch(undefined, '/list');

    const result = resolveBreadcrumbMatches(
      {
        matched: [parent, defaultChild],
        meta: {
          activePath: '/list',
          breadcrumbUseActivePath: true,
          title: 'List',
        },
      },
      () => ({ matched: [parent] }),
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toBe(parent);
    expect(result[1]).toBe(defaultChild);
  });
});
