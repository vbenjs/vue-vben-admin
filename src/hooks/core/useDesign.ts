import { computed, getCurrentInstance, unref } from 'compatible-vue';
import { useSetting } from '@/hooks/core/useSetting';

/**
 * @description: 获取 组件样式前缀,返回组件样式名及icon名
 * @param scope: 组件域域名
 */
export const useDesign = (scope: string) => {
  const { designSetting } = useSetting();
  const prefixCls = designSetting.prefixCls;

  // 兼容非组件内部使用
  const instance = getCurrentInstance();
  const cls = `${prefixCls}-${scope}`;
  const scopeClsRef = instance ? computed(() => cls) : cls;
  return {
    prefixCls: unref(scopeClsRef),
    prefixVar: prefixCls,
  };
};
