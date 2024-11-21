import { type Router } from 'vue-router';

import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';

import microApp from '@micro-zoe/micro-app';
import { cloneDeep } from 'lodash-es';

interface DataListenerType {
  [key: string]: any;
  appName: string;
}

/**
 * 数据监听
 * @param data
 */
export function dataListener(data: DataListenerType) {
  console.warn(`接收到来自 子应用 ${data.appName} 的信息::::`, data);
}

export async function microAppInit(router: Router) {
  microApp.router.setBaseAppRouter(router);
  microApp.start({
    'disable-memory-router': false, // 禁用内存路由
    'disable-sandbox': false, // 全局禁用沙箱
    'disable-scopecss': true, // 全局禁用样式隔离
    iframe: true, // 使用iframe
    'keep-alive': true, // 开启keep-alive
    'keep-router-state': false, // 保留路由状态
    /* 生命周期 */
    lifeCycles: {
      afterhidden(e: CustomEvent) {
        console.warn(`子应用${e}推入后台时`);
      },
      aftershow(e: CustomEvent) {
        console.warn(`子应用${e}推入前台之后`);
      },
      beforemount(_e: any, appName: string) {
        console.warn(`子应用${appName}即将渲染`);
      },
      beforeshow(e: CustomEvent) {
        console.warn(`子应用${e}推入前台之前`);
      },
      created(_e: any, appName: string) {
        const accessStore = useAccessStore();
        const userStore = useUserStore();
        // 设置 layout 模式
        const mainPreferences = cloneDeep(preferences);
        mainPreferences.app.layout = 'full-content';
        console.warn(`子应用${appName}被创建`);
        microApp.setData(appName, {
          accessToken: accessStore.accessToken,
          mainPreferences,
          userInfo: userStore.userInfo,
        });
      },
      error(_e: { detail: any }, appName: string) {
        console.warn(`子应用${appName}加载出错`, _e.detail);
      },
      mounted(_e: any, appName: string) {
        microApp.addDataListener(appName, dataListener);
        console.warn(`子应用${appName}已经渲染完成`);
        // setTimeout(() => {
        //   /*setData第一个参数为子应用名称，第二个参数为传递的数据，它发送的数据都会被缓存下来。micro-app会遍历新旧值中的每个key判断值是否有变化，如果所有数据都相同则不会发送（注意：只会遍历第一层key），如果数据有变化则将新旧值进行合并后发送。
        //    */
        //   microApp.setData(appName, { msg: '基座应用询问是否渲染完成' });
        // }, 2000);
      },
      unmount(_e: any, appName: string) {
        microApp.clearDataListener(appName);
        console.warn(`子应用${appName}已经卸载`);
      },
    },
    plugins: {
      modules: {
        antd: [
          {
            // fetch获得代码后对js代码的处理:
            // import xx from xx 替换成
            // import xx from http://子应用地址/{vite.baseName}/xxx
            loader(code: string) {
              if (!import.meta.env.PROD) {
                // 这里 /basename/ 需要和子应用vite.config.js中base的配置保持一致
                code = code.replaceAll(
                  /(from|import)(\s*['"])(\/vben-antd\/)/g,
                  (all: string) => {
                    return all.replace(
                      '/vben-antd/',
                      'http://localhost:5777/vben-antd/',
                    );
                  },
                );
              }

              return code;
            },
          },
        ],
      },
    },
    // tagName: 'vben-micro-main-app',
    'router-mode': 'state', // 设置路由模式 共四种: search (默认) native native-scope pure state
  });
}
