const BasicLayout = () => import('./basic.vue');
const AuthPageLayout = () => import('./auth.vue');

const IFrameView = () => import('@vben/layouts').then((m) => m.IFrameView);
const MicroAppView = () => import('@vben/layouts').then((m) => m.MicroView);
export { AuthPageLayout, BasicLayout, IFrameView, MicroAppView };
