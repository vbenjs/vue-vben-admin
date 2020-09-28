import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';
const IFrame = () => import('/@/views/sys/iframe/FrameBlank.vue');

export default {
  layout: {
    path: '/frame',
    name: 'Frame',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/frame/antv',
    meta: {
      icon: 'ant-design:home-outlined',
      title: '外部页面',
    },
  },

  routes: [
    {
      path: '/antv',
      name: 'Antv',
      component: IFrame,
      meta: {
        frameSrc: 'https://2x.antdv.com/docs/vue/introduce-cn/',
        title: 'antVue文档(内嵌)',
      },
    },
    {
      path: '/doc',
      name: 'Doc',
      component: IFrame,
      meta: {
        frameSrc: 'https://vvbin.cn/docs/',
        title: '项目文档(内嵌)',
      },
    },
    {
      path: '/docExternal',
      name: 'DocExternal',
      component: IFrame,
      meta: {
        externalLink: 'https://vvbin.cn/docs/',
        title: '项目文档(外链)',
      },
    },
  ],
} as AppRouteModule;
