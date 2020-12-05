import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
const IFrame = () => import('/@/views/sys/iframe/FrameBlank.vue');

const iframe: AppRouteModule = {
  path: '/frame',
  name: 'Frame',
  component: LAYOUT,
  redirect: '/frame/antv',
  meta: {
    icon: 'mdi:page-next-outline',
    title: 'routes.demo.iframe.frame',
  },

  children: [
    {
      path: 'antv',
      name: 'Antv',
      component: IFrame,
      meta: {
        frameSrc: 'https://2x.antdv.com/docs/vue/introduce-cn/',
        title: 'routes.demo.iframe.antv',
      },
    },
    {
      path: 'doc',
      name: 'Doc',
      component: IFrame,
      meta: {
        frameSrc: 'https://vvbin.cn/doc-next/',
        title: 'routes.demo.iframe.doc',
      },
    },
    {
      path: 'docExternal',
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
