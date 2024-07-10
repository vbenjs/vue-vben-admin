import { sleep } from '@/utils';
import { Controller, Get, HttpCode, HttpStatus, Request } from '@nestjs/common';

@Controller('menu')
export class MenuController {
  /**
   *  获取用户所有菜单
   */
  @Get('getAll')
  @HttpCode(HttpStatus.OK)
  async getAll(@Request() req: Request) {
    // 模拟请求延迟
    await sleep(500);
    // 请求用户的id
    const userId = req.user.id;

    // TODO: 改为表方式获取
    const dashboardMenus = [
      {
        component: 'BasicLayout',
        meta: {
          order: -1,
          title: 'page.dashboard.title',
        },
        name: 'Dashboard',
        path: '/',
        redirect: '/analytics',
        children: [
          {
            name: 'Analytics',
            path: '/analytics',
            component: '/dashboard/analytics/index',
            meta: {
              affixTab: true,
              title: 'page.dashboard.analytics',
            },
          },
          {
            name: 'Workspace',
            path: '/workspace',
            component: '/dashboard/workspace/index',
            meta: {
              title: 'page.dashboard.workspace',
            },
          },
        ],
      },
    ];

    const createDemosMenus = (role: 'admin' | 'super' | 'user') => {
      const roleWithMenus = {
        admin: {
          component: '/demos/access/backend/admin-visible',
          meta: {
            icon: 'mdi:button-cursor',
            title: 'page.demos.access.adminVisible',
          },
          name: 'AccessBackendAdminVisible',
          path: 'admin-visible',
        },
        super: {
          component: '/demos/access/backend/super-visible',
          meta: {
            icon: 'mdi:button-cursor',
            title: 'page.demos.access.superVisible',
          },
          name: 'AccessBackendSuperVisible',
          path: 'super-visible',
        },
        user: {
          component: '/demos/access/backend/user-visible',
          meta: {
            icon: 'mdi:button-cursor',
            title: 'page.demos.access.userVisible',
          },
          name: 'AccessBackendUserVisible',
          path: 'user-visible',
        },
      };

      return [
        {
          component: 'BasicLayout',
          meta: {
            icon: 'ic:baseline-view-in-ar',
            keepAlive: true,
            order: 1000,
            title: 'page.demos.title',
          },
          name: 'Demos',
          path: '/demos',
          redirect: '/demos/access',
          children: [
            {
              meta: {
                icon: 'mdi:shield-key-outline',
                title: 'page.demos.access.title',
              },
              name: 'Access',
              path: 'access',
              redirect: '/demos/access/backend',
              children: [
                {
                  name: 'AccessBackend',
                  path: 'backend',
                  meta: {
                    icon: 'mdi:cloud-key-outline',
                    title: 'page.demos.access.backendControl',
                  },
                  redirect: '/demos/access/backend/page-control',
                  children: [
                    {
                      name: 'AccessBackendPageControl',
                      path: 'page-control',
                      component: '/demos/access/backend/index',
                      meta: {
                        icon: 'mdi:page-previous-outline',
                        title: 'page.demos.access.pageAccess',
                      },
                    },
                    {
                      name: 'AccessBackendButtonControl',
                      path: 'button-control',
                      component: '/demos/access/backend/button-control',
                      meta: {
                        icon: 'mdi:button-cursor',
                        title: 'page.demos.access.buttonControl',
                      },
                    },
                    roleWithMenus[role],
                  ],
                },
              ],
            },
          ],
        },
      ];
    };

    const MOCK_MENUS = [
      {
        menus: [...dashboardMenus, ...createDemosMenus('super')],
        userId: 0,
      },
      {
        menus: [...dashboardMenus, ...createDemosMenus('admin')],
        userId: 1,
      },
      {
        menus: [...dashboardMenus, ...createDemosMenus('user')],
        userId: 2,
      },
    ];

    return MOCK_MENUS.find((item) => item.userId === userId)?.menus ?? [];
  }
}
