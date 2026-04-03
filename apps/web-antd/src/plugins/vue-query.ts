import type { VueQueryPluginOptions } from '@tanstack/vue-query';

import type { App } from 'vue';

import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';

/**
 * 创建全局 QueryClient 实例
 * - staleTime: 数据在 30 秒内视为"新鲜"，不会自动重新请求
 * - gcTime: 缓存在 5 分钟后被垃圾回收
 * - retry: 网络请求失败时最多自动重试 1 次
 * - refetchOnWindowFocus: 用户切回浏览器窗口时自动静默刷新数据
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 30 秒内数据视为"新鲜"，不会触发后台重新获取
      staleTime: 30 * 1000,
      // 缓存在 5 分钟后被垃圾回收
      gcTime: 5 * 60 * 1000,
      // 失败时最多重试 1 次
      retry: 1,
      // 切换回浏览器窗口时自动静默刷新
      refetchOnWindowFocus: true,
    },
  },
});

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClient,
};

/**
 * 安装 Vue Query 插件到 Vue 应用实例
 * @param app Vue 应用实例
 */
export function setupVueQuery(app: App) {
  app.use(VueQueryPlugin, vueQueryPluginOptions);
}

export { queryClient };
