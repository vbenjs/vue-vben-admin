const BasicLayout = () => import('./basic.vue');
const AuthPageLayout = () => import('./auth.vue');

const IFrameView = () => import('@vben/layouts').then((m) => m.IFrameView);
const LayoutUI = () => import('@vben/layouts').then((m) => m.LayoutUI);
const LayoutContent = () =>
  import('@vben/layouts').then((m) => m.LayoutContent);

export { AuthPageLayout, BasicLayout, IFrameView, LayoutContent, LayoutUI };
