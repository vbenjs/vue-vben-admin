const BasicLayout = () => import('./basic.vue');

const IFrameView = () => import('@vben/layouts').then((m) => m.IFrameView);

const AuthPageLayout = () =>
  import('@vben/layouts').then((m) => m.AuthPageLayout);

export { AuthPageLayout, BasicLayout, IFrameView };
