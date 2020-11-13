import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 20,
  menu: {
    name: '页面',
    path: '/page-demo',
    tag: {
      dot: true,
    },
    children: [
      {
        path: 'result',
        name: '结果页',
        tag: {
          content: 'new',
        },
        children: [
          {
            path: 'success',
            name: '成功页',
          },
          {
            path: 'fail',
            name: '失败页',
          },
        ],
      },
      {
        path: 'exception',
        name: '异常页',
        children: [
          {
            path: '403',
            name: '403',
          },
          {
            path: '404',
            name: '404',
          },
          {
            path: '500',
            name: '500',
          },
          {
            path: 'net-work-error',
            name: '网络错误',
          },
          {
            path: 'not-data',
            name: '无数据',
          },
        ],
      },
    ],
  },
};
export default menu;
