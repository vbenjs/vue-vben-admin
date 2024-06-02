import { describe, expect, it, vi } from 'vitest';

import { generatorMenus } from './generator-menus'; // 替换为您的实际路径
import {
  type RouteRecordRaw,
  type Router,
  createRouter,
  createWebHistory,
} from 'vue-router';

// Nested route setup to test child inclusion and hideChildrenInMenu functionality

describe('generatorMenus', () => {
  // 模拟路由数据
  const mockRoutes = [
    {
      meta: { icon: 'home-icon', title: '首页' },
      name: 'home',
      path: '/home',
    },
    {
      meta: { hideChildrenInMenu: true, icon: 'about-icon', title: '关于' },
      name: 'about',
      path: '/about',
      children: [
        {
          path: 'team',
          name: 'team',
          meta: { icon: 'team-icon', title: '团队' },
        },
      ],
    },
  ] as RouteRecordRaw[];

  // 模拟 Vue 路由器实例
  const mockRouter = {
    getRoutes: vi.fn(() => [
      { name: 'home', path: '/home' },
      { name: 'about', path: '/about' },
      { name: 'team', path: '/about/team' },
    ]),
  };

  it('the correct menu list should be generated according to the route', async () => {
    const expectedMenus = [
      {
        badge: undefined,
        badgeType: undefined,
        badgeVariants: undefined,
        icon: 'home-icon',
        name: '首页',
        orderNo: undefined,
        parent: undefined,
        parents: undefined,
        path: '/home',
        children: [],
      },
      {
        badge: undefined,
        badgeType: undefined,
        badgeVariants: undefined,
        icon: 'about-icon',
        name: '关于',
        orderNo: undefined,
        parent: undefined,
        parents: undefined,
        path: '/about',
        children: [],
      },
    ];

    const menus = await generatorMenus(mockRoutes, mockRouter as any);
    expect(menus).toEqual(expectedMenus);
  });

  it('includes additional meta properties in menu items', async () => {
    const mockRoutesWithMeta = [
      {
        meta: { icon: 'user-icon', orderNo: 1, title: 'Profile' },
        name: 'profile',
        path: '/profile',
      },
    ] as RouteRecordRaw[];

    const menus = await generatorMenus(mockRoutesWithMeta, mockRouter as any);
    expect(menus).toEqual([
      {
        badge: undefined,
        badgeType: undefined,
        badgeVariants: undefined,
        icon: 'user-icon',
        name: 'Profile',
        orderNo: 1,
        parent: undefined,
        parents: undefined,
        path: '/profile',
        children: [],
      },
    ]);
  });

  it('handles dynamic route parameters correctly', async () => {
    const mockRoutesWithParams = [
      {
        meta: { icon: 'details-icon', title: 'User Details' },
        name: 'userDetails',
        path: '/users/:userId',
      },
    ] as RouteRecordRaw[];

    const menus = await generatorMenus(mockRoutesWithParams, mockRouter as any);
    expect(menus).toEqual([
      {
        badge: undefined,
        badgeType: undefined,
        badgeVariants: undefined,
        icon: 'details-icon',
        name: 'User Details',
        orderNo: undefined,
        parent: undefined,
        parents: undefined,
        path: '/users/:userId',
        children: [],
      },
    ]);
  });

  it('processes routes with redirects correctly', async () => {
    const mockRoutesWithRedirect = [
      {
        name: 'redirectedRoute',
        path: '/old-path',
        redirect: '/new-path',
      },
      {
        meta: { icon: 'path-icon', title: 'New Path' },
        name: 'newPath',
        path: '/new-path',
      },
    ] as RouteRecordRaw[];

    const menus = await generatorMenus(
      mockRoutesWithRedirect,
      mockRouter as any,
    );
    expect(menus).toEqual([
      // Assuming your generatorMenus function excludes redirect routes from the menu
      {
        badge: undefined,
        badgeType: undefined,
        badgeVariants: undefined,
        icon: undefined,
        name: 'redirectedRoute',
        orderNo: undefined,
        parent: undefined,
        parents: undefined,
        path: '/old-path',
        children: [],
      },
      {
        badge: undefined,
        badgeType: undefined,
        badgeVariants: undefined,
        icon: 'path-icon',
        name: 'New Path',
        orderNo: undefined,
        parent: undefined,
        parents: undefined,
        path: '/new-path',
        children: [],
      },
    ]);
  });

  const routes: any = [
    {
      meta: { orderNo: 2, title: 'Home' },
      name: 'home',
      path: '/',
    },
    {
      meta: { orderNo: 1, title: 'About' },
      name: 'about',
      path: '/about',
    },
  ];

  const router: Router = createRouter({
    history: createWebHistory(),
    routes,
  });

  it('should generate menu list with correct order', async () => {
    const menus = await generatorMenus(routes, router);
    const expectedMenus = [
      {
        badge: undefined,
        badgeType: undefined,
        badgeVariants: undefined,
        icon: undefined,
        name: 'About',
        orderNo: 1,
        parent: undefined,
        parents: undefined,
        path: '/about',
        children: [],
      },
      {
        badge: undefined,
        badgeType: undefined,
        badgeVariants: undefined,
        icon: undefined,
        name: 'Home',
        orderNo: 2,
        parent: undefined,
        parents: undefined,
        path: '/',
        children: [],
      },
    ];

    expect(menus).toEqual(expectedMenus);
  });

  it('should handle empty routes', async () => {
    const emptyRoutes: any[] = [];
    const menus = await generatorMenus(emptyRoutes, router);
    expect(menus).toEqual([]);
  });
});
