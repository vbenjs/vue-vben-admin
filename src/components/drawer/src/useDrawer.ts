import { UseDrawerReturnType, DrawerInstance, ReturnMethods, DrawerProps } from './types';
import { ref, Ref, getCurrentInstance, onUnmounted, unref } from 'compatible-vue';

import { isProdMode } from '@/utils/envUtil';

/**
 * @description: 适用于将drawer独立出去,外面调用
 */
export function useDrawer(): UseDrawerReturnType {
  if (!getCurrentInstance()) {
    throw new Error('Please put useDrawer function in the setup function!');
  }
  const drawerRef = ref<DrawerInstance | null>(null);
  const loadedRef = ref<boolean | null>(false);
  const isFirstLoadRef = ref<boolean | null>(true);
  let innerProps: any = null;

  function getDrawer(drawerInstance: DrawerInstance) {
    onUnmounted(() => {
      drawerRef.value = null;
      loadedRef.value = null;
      isFirstLoadRef.value = null;
      innerProps = null;
    });
    if (unref(loadedRef) && drawerInstance === unref(drawerRef) && isProdMode()) {
      return;
    }
    drawerRef.value = drawerInstance;
    loadedRef.value = true;
    unref(drawerRef) && unref(drawerRef)!.setDrawerProps(innerProps || {});
  }
  const methods: ReturnMethods = {
    /**
     * @description: 设置表格参数
     */
    setDrawerProps: (props: Partial<DrawerProps>): void => {
      if (!unref(drawerRef)) {
        return;
      }
      unref(drawerRef)!.setDrawerProps(props);
    },
    isFirstLoadRef: isFirstLoadRef as Ref<boolean>,
    openDrawer: (props: Partial<DrawerProps>): void => {
      if (unref(isFirstLoadRef)) {
        isFirstLoadRef.value = false;
        innerProps = props;
      } else {
        unref(drawerRef) && unref(drawerRef)!.setDrawerProps(props);
      }
    },
  };

  return [getDrawer, methods];
}
