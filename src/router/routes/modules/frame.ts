import { RouteConfigEx, LayoutType, ModuleRouteConfig } from '@/router/type';

import { createAsyncComponent } from '@/common/factory/AsyncComponentFactory';
import { PAGE_LAYOUT_COMPONENT } from '@/router/constant';

const IFrame = () => createAsyncComponent(import('@/views/sys/iframe/FrameBlank.vue'));

const prefix = '/frame';

const layout: LayoutType = {
  path: prefix,
  component: PAGE_LAYOUT_COMPONENT,
  meta: {
    title: '外部页面',
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
    path: '/baidu',
    name: 'Baidu',
    component: IFrame,
    meta: {
      frameSrc: 'https://www.baidu.com',
      title: '百度(内嵌)',
    },
  },
  {
    path: '/baiduExternal',
    name: 'BaiduExternal',
    component: IFrame,
    meta: {
      externalLink: 'https://www.baidu.com',
      title: '百度(外链)',
    },
  },
];

export default {
  routes: routes,
  prefix,
  layout,
} as ModuleRouteConfig;
