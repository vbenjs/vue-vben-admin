import { computed, unref } from '@/setup/vue';

import { appStore } from '@/store/modules/app';

import { useRouter } from '@/hooks/core/useRouter';
/**
 * @description: 全屏显示内容
 */
export const useFullContent = () => {
  // 是否全屏显示内容,不显示菜单
  const getFullContent = computed(() => {
    const { route } = useRouter();
    // 查询参数,地址栏有full参数即显示全屏
    const query = unref(route).query;
    if (query && Reflect.has(query, '__full__')) {
      return true;
    }
    // 返回配置文件中的配置
    return appStore.getProjCfg.fullContent;
  });
  return { getFullContent };
};
