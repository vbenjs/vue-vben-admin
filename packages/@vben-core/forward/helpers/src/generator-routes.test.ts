import type { RouteRecordRaw } from 'vue-router';

import { describe, expect, it } from 'vitest';

import { generatorRoutes, hasAuthority, hasVisible } from './generator-routes';

// Mock 路由数据
const mockRoutes = [
  {
    meta: {
      authority: ['admin', 'user'],
      hideInMenu: false,
    },
    path: '/dashboard',
    children: [
      {
        path: '/dashboard/overview',
        meta: { authority: ['admin'], hideInMenu: false },
      },
      {
        path: '/dashboard/stats',
        meta: { authority: ['user'], hideInMenu: true },
      },
    ],
  },
  {
    meta: { authority: ['admin'], hideInMenu: false },
    path: '/settings',
  },
  {
    meta: { hideInMenu: false },
    path: '/profile',
  },
] as RouteRecordRaw[];

describe('hasAuthority', () => {
  it('should return true if there is no authority defined', () => {
    expect(hasAuthority(mockRoutes[2], ['admin'])).toBe(true);
  });

  it('should return true if the user has the required authority', () => {
    expect(hasAuthority(mockRoutes[0], ['admin'])).toBe(true);
  });

  it('should return false if the user does not have the required authority', () => {
    expect(hasAuthority(mockRoutes[1], ['user'])).toBe(false);
  });
});

describe('hasVisible', () => {
  it('should return true if hideInMenu is not set or false', () => {
    expect(hasVisible(mockRoutes[0])).toBe(true);
    expect(hasVisible(mockRoutes[2])).toBe(true);
  });

  it('should return false if hideInMenu is true', () => {
    expect(hasVisible(mockRoutes[0].children?.[1])).toBe(false);
  });
});

describe('generatorRoutes', () => {
  it('should filter routes based on authority and visibility', async () => {
    const generatedRoutes = await generatorRoutes(mockRoutes, ['user']);
    // The user should have access to /dashboard/stats, but it should be filtered out because it's not visible
    expect(generatedRoutes).toEqual([
      {
        meta: { authority: ['admin', 'user'], hideInMenu: false },
        path: '/dashboard',
        children: [],
      },
      // Note: We expect /settings to be filtered out because the user does not have 'admin' authority
      {
        meta: { hideInMenu: false },
        path: '/profile',
      },
    ]);
  });

  it('should handle routes without children', async () => {
    const generatedRoutes = await generatorRoutes(mockRoutes, ['user']);
    expect(generatedRoutes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: '/profile', // This route has no children and should be included
        }),
      ]),
    );
  });

  it('should handle empty roles array', async () => {
    const generatedRoutes = await generatorRoutes(mockRoutes, []);
    expect(generatedRoutes).toEqual(
      expect.arrayContaining([
        // Only routes without authority should be included
        expect.objectContaining({
          path: '/profile',
        }),
      ]),
    );
    expect(generatedRoutes).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: '/dashboard',
        }),
        expect.objectContaining({
          path: '/settings',
        }),
      ]),
    );
  });

  it('should handle missing meta fields', async () => {
    const routesWithMissingMeta = [
      { path: '/path1' }, // No meta
      { meta: {}, path: '/path2' }, // Empty meta
      { meta: { authority: ['admin'] }, path: '/path3' }, // Only authority
    ];
    const generatedRoutes = await generatorRoutes(
      routesWithMissingMeta as RouteRecordRaw[],
      ['admin'],
    );
    expect(generatedRoutes).toEqual([
      { path: '/path1' },
      { meta: {}, path: '/path2' },
      { meta: { authority: ['admin'] }, path: '/path3' },
    ]);
  });
});
