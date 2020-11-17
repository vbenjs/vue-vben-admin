/*
 * @description: Do not edit
 * @author: cxiaoting
 * @Date: 2020-11-13 14:00:37
 * @LastEditors: cxiaoting
 * @LastEditTime: 2020-11-13 18:07:11
 */
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
      {
        path: 'account',
        name: '个人页',
        tag: {
          content: 'new',
        },
        children: [
          {
            path: 'center',
            name: '个人中心',
          },
          {
            path: 'setting',
            name: '个人设置',
          },
        ],
      },
    ],
  },
};
export default menu;
