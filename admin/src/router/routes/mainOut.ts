/**
The routing of this file will not show the layout.
It is an independent new page.
the contents of the file still need to log in to access

这个文件的路由不会显示布局。
这是一个独立的新页面。
文件内容仍需登录才能访问
 */

// test
// http:ip:port/main-out
export const mainOutRoutes: RouteRecordItem[] = [
  {
    path: '/main-out',
    name: 'MainOut',
    component: () => import('/@/views/demo/main-out/index.vue'),
    meta: {
      title: 'MainOut',
      ignoreAuth: true,
    },
  },
]

export const mainOutRouteNames = mainOutRoutes.map((item) => item.name)
