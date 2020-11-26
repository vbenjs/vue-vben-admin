import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';
const IFrame = () => import('/@/views/sys/iframe/FrameBlank.vue');

const iframe: AppRouteModule = {
  layout: {
    path: '/frame',
    name: 'Frame',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/frame/antv',
    meta: {
      icon: 'mdi:page-next-outline',
      title: 'routes.demo.iframe.frame',
    },
  },

  routes: [
    {
      path: '/antv',
      name: 'Antv',
      component: IFrame,
      meta: {
        frameSrc: 'https://2x.antdv.com/docs/vue/introduce-cn/',
        title: 'routes.demo.iframe.antv',
        afterCloseLoading: true,
      },
    },
    {
      path: '/doc',
      name: 'Doc',
      component: IFrame,
      meta: {
        frameSrc: 'https://vvbin.cn/doc-next/',
        title: 'routes.demo.iframe.doc',
        afterCloseLoading: true,
      },
    },
    {
      path: '/docExternal',
      name: 'DocExternal',
      component: IFrame,
      meta: {
        externalLink: 'https://vvbin.cn/doc-next/',
        title: 'routes.demo.iframe.docExternal',
      },
    },
  ],
};

export default iframe;
