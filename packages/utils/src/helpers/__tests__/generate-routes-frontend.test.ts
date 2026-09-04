import type { RouteRecordRaw } from 'vue-router';

import { describe, expect, it } from 'vitest';

import {
  generateRoutesByFrontend,
  hasAuthority,
} from '../generate-routes-frontend';

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

describe('generateRoutesByFrontend', () => {
  it('should handle routes without children', async () => {
    const generatedRoutes = await generateRoutesByFrontend(mockRoutes, [
      'user',
    ]);
    expect(generatedRoutes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: '/profile', // This route has no children and should be included
        }),
      ]),
    );
  });

  it('should handle empty roles array', async () => {
    const generatedRoutes = await generateRoutesByFrontend(mockRoutes, []);
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
    const generatedRoutes = await generateRoutesByFrontend(
      routesWithMissingMeta as RouteRecordRaw[],
      ['admin'],
    );
    expect(generatedRoutes).toEqual([
      { path: '/path1' },
      { meta: {}, path: '/path2' },
      { meta: { authority: ['admin'] }, path: '/path3' },
    ]);
  });

  it('should not corrupt the source route table across repeated generations', async () => {
    // 复现场景：低权限用户先登录，同一会话内再以更高权限重新生成路由。
    // filterTree 曾把上一次过滤掉的子节点写回源路由表，
    // 导致高权限用户再也拿不到那些路由。
    const routes = [
      {
        meta: { authority: ['admin', 'user'] },
        path: '/dashboard',
        children: [
          { path: '/dashboard/overview', meta: { authority: ['admin'] } },
          { path: '/dashboard/stats', meta: { authority: ['user'] } },
        ],
      },
    ] as unknown as RouteRecordRaw[];

    await generateRoutesByFrontend(routes, ['user']);
    const asAdmin = await generateRoutesByFrontend(routes, ['admin']);

    expect(asAdmin[0]?.children?.map((child) => child.path)).toEqual([
      '/dashboard/overview',
    ]);
  });
});
