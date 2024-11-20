// 子服务设置

// useUserStore
import { useAccessStore } from '@vben/stores';
// preferences
import { updatePreferences } from '@vben/preferences';

import { router } from './router';

declare global {
  interface Window {
    // 关闭沙箱时,不存在window.eventCenterForAppNameVite对象 2024年8月20日 by jeff
    // eventCenterForAppNameVite: any;
    microApp: any; // EventCenterForMicroApp
    __MICRO_APP_NAME__: string;
    __MICRO_APP_ENVIRONMENT__: string;
    __MICRO_APP_BASE_APPLICATION__: string;
  }
}
// const MAIN_ROUTER = window.microApp.router.getBaseAppRouter();

/**
 * 与基座进行数据交互
 * 在不关闭沙箱的模式下,子应用中的window为代理对象,和真正的window对象(windows.rawWindow)不是一个对象.
 * 重要属性:
 * window.rawWindow 原始window对象-基座的window对象
 * window.microApp<EventCenterForMicroApp>.getData() 获得基座传入的参数
 * windows.__MICRO_APP_BASE_APPLICATION__
 * windows.rawWindow.eventCenterForAppNameVite==undefined
 * @param {*} data
 */
function handleDataListener(data: Record<string, any>) {
  // 以下代码为开启沙箱时的代码
  try {
    const {
      accessToken = undefined,
      hash = '/',
      mainPreferences = undefined,
    } = data;

    // Object.keys(data).forEach((key) => {
    //   console.warn(`子应用获得基座数据 ${key}: `, data[key]);
    // });
    const accessStore = useAccessStore();
    accessStore.setAccessToken(accessToken);
    if (mainPreferences) updatePreferences(mainPreferences);

    // 当基座下发path时进行跳转
    if (hash === router.currentRoute.value.hash) {
      console.warn('基座下发的path为空或者与当前路由相同');
    } else {
      router.push(hash as string);
      console.warn('router.currentRoute:::', router.currentRoute);
      // history.replaceState(history.state, '', hash);
    }
    // 向基座发送数据
    // setTimeout(() => {
    //   mainRouter.push('/');
    //   window.microApp.dispatch({
    //     AppName: data.AppName,
    //     data: '向基座发送数据' + data.hash,
    //   });
    // }, 3000);
  } catch (error) {
    console.error('向基座发送数据失败', error);
  }
}

export { handleDataListener };
