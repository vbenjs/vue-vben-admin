import { UseDrawerReturnType, DrawerInstance, ReturnMethods, DrawerProps } from './types';
import { ref, getCurrentInstance, onUnmounted, unref } from 'compatible-vue';
import { isBoolean } from '@/utils/is/index';

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
  // const isFirstLoadRef = ref<boolean | null>(true);
  // let innerProps: any = null;

  function getDrawer(drawerInstance: DrawerInstance) {
    isProdMode() &&
      onUnmounted(() => {
        drawerRef.value = null;
        loadedRef.value = null;
        // isFirstLoadRef.value = null;
        // innerProps = null;
      });
    if (unref(loadedRef) && drawerInstance === unref(drawerRef) && isProdMode()) {
      return;
    }
    drawerRef.value = drawerInstance;
    loadedRef.value = true;
    // unref(drawerRef) && unref(drawerRef)!.setDrawerProps(innerProps || {});
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
    isFirstLoadRef: ref(false),
    openDrawer: (props: Partial<DrawerProps> | boolean): void => {
      // if (unref(isFirstLoadRef)) {
      //   isFirstLoadRef.value = false;
      //   innerProps = props;
      // } else {

      const drawer = unref(drawerRef);
      if (!drawer) {
        return;
      }
      if (isBoolean(props)) {
        drawer.setDrawerProps({
          visible: props,
        });
      } else {
        drawer.setDrawerProps(props);
      }
      // }
    },
  };

  return [getDrawer, methods];
}
