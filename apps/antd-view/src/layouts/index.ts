const BasicLayout = () => import('./basic.vue');

const IFrameView = () => import('@vben/layouts').then((m) => m.IFrameView);

const AuthPageLayoutType = () =>
  import('@vben/layouts').then((m) => m.AuthPageLayoutType);

export { AuthPageLayoutType, BasicLayout, IFrameView };
