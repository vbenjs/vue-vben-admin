const Layout = () => import('@/layout.vue');

const IFrameView = () => import('@vben/layouts').then((m) => m.IFrameView);

const AuthPageLayout = () =>
  import('@vben/layouts').then((m) => m.AuthPageLayout);

export { AuthPageLayout, IFrameView, Layout };
