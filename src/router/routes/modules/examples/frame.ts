import { RouteConfigEx, LayoutType, ModuleRouteConfig } from '@/router/types';

import { createAsyncComponent } from '@/common/factory/AsyncComponentFactory';
import { PAGE_LAYOUT_COMPONENT } from '@/router/constant';

const IFrame = () => createAsyncComponent(import('@/views/sys/iframe/FrameBlank.vue'));

const prefix = '/frame';

const layout: LayoutType = {
  path: '/frame',
  component: PAGE_LAYOUT_COMPONENT,
  meta: {
    title: '外部页面',
    icon: 'block',
  },
};

const routes: RouteConfigEx[] = [
  {
    path: '/antv',
    name: 'Antv',
    component: IFrame,
    meta: {
      frameSrc: 'https://www.antdv.com/components/rate-cn/',
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
];

export default {
  routes: routes,
  prefix,
  layout,
} as ModuleRouteConfig;
