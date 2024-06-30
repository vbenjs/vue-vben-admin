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
    await sleep(1000);
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
    const MOCK_MENUS = [
      {
        menus: [...dashboardMenus],
        userId: 0,
      },
      {
        menus: [...dashboardMenus],
        userId: 1,
      },
    ];

    return MOCK_MENUS.find((item) => item.userId === userId)?.menus ?? [];
  }
}
