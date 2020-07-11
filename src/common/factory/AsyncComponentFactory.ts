/**
 * vue异步组件,带超时及loading
 */
import {
  Component,
  EsModuleComponent,
  FunctionalComponentOptions,
  AsyncComponentPromise,
} from 'vue/types/options';
import { LOADING_PAGE, TIMEOUT_PAGE, TIMEOUT, DELAY } from '@/settings/asyncComponentSetting';
export interface AsyncComponentFactoryOptions {
  component: AsyncComponentPromise;
  loading?: Component | EsModuleComponent;
  error?: Component | EsModuleComponent;
  delay?: number;
  timeout?: number;
}
export type AsyncComponent = AsyncComponentPromise;
/**
 * @description: 异步组件加载器
 */

/**
 * @description: 异步组件工厂
 */
export function createAsyncComponent(options: any): Promise<FunctionalComponentOptions> {
  function asyncHandler(): any {
    const defOptions = {
      loading: LOADING_PAGE,
      delay: DELAY,
      error: TIMEOUT_PAGE,
      timeout: TIMEOUT,
    };
    // AsyncComponentFactoryOptions type
    if (Reflect.has(options, 'component')) {
      const { component } = options as AsyncComponentFactoryOptions;
      return {
        component: component,
        ...defOptions,
        ...options,
      };
    }
    // AsyncComponentPromise type
    return {
      component: options as AsyncComponentPromise,
      ...defOptions,
    };
  }
  return Promise.resolve({
    functional: true,
    render(h, { data, children }) {
      return h(asyncHandler, data, children);
    },
  });
}
