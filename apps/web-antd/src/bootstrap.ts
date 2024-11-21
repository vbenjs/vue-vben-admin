import { type App as AppInstance, createApp, watchEffect } from 'vue';

import { registerAccessDirective } from '@vben/access';
import { preferences } from '@vben/preferences';
import { initStores } from '@vben/stores';
import '@vben/styles';
import '@vben/styles/antd';

import { useTitle } from '@vueuse/core';

import { $t, setupI18n } from '#/locales';

import { initComponentAdapter } from './adapter/component';
import App from './app.vue';
// import { type Router } from 'vue-router';
import { router } from './router';
import { handleDataListener } from './useChildMicro';

/**
 * 与基座进行数据交互
 */
function handleMicroData() {
  // 是否是微前端环境
  if (window.__MICRO_APP_ENVIRONMENT__) {
    // 主动获取基座下发的数据
    window.microApp.addDataListener(handleDataListener, true);
  }
}

let app: AppInstance | null = null;
// 将渲染操作放入 mount 函数
async function mount(namespace: string) {
  // 初始化组件适配器
  await initComponentAdapter();

  app = createApp(App);

  // 国际化 i18n 配置
  await setupI18n(app);

  // 配置 pinia-tore
  await initStores(app, { namespace });

  // 安装权限指令
  registerAccessDirective(app);

  // 配置路由及路由守卫
  app.use(router);

  // 动态更新标题
  watchEffect(() => {
    if (preferences.app.dynamicTitle) {
      const routeTitle = router.currentRoute.value.meta?.title;
      const pageTitle =
        (routeTitle ? `${$t(routeTitle)} - ` : '') + preferences.app.name;
      useTitle(pageTitle);
    }
  });

  app.mount('#antd-app');

  handleMicroData();
}
// 将卸载操作放入 unmount 函数
function unmount() {
  app?.unmount();
  // history?.destroy();
  // 卸载所有数据监听函数,开启沙箱情况下不再需要
  window.microApp.clearDataListener();

  app = null;
  // router = null;
  // history = null;
  console.warn('微应用卸载了,微应用的 unmount() fired');
}

async function bootstrap(namespace: string) {
  if (window.__MICRO_APP_ENVIRONMENT__) {
    console.warn('检测微应用环境', window.__MICRO_APP_ENVIRONMENT__);
    const EXPOSE_MICRO_APP_NAME = `vben-micro-${window.__MICRO_APP_NAME__}`;
    // 微前端环境下挂载到 window 上
    // @ts-ignore 为了规避 ts 类型检查
    (window as any)[EXPOSE_MICRO_APP_NAME] = {
      mount: async (ns: string) => await mount(ns),
      unmount,
    };
    await (window as any)[EXPOSE_MICRO_APP_NAME].mount(namespace);
  } else {
    console.warn('非微前端环境');
    // 非微前端环境直接渲染
    mount(namespace);
  }
}

export { bootstrap };
