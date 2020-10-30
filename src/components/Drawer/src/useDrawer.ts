import type {
  UseDrawerReturnType,
  DrawerInstance,
  ReturnMethods,
  DrawerProps,
  UseDrawerInnerReturnType,
} from './types';

import { ref, getCurrentInstance, onUnmounted, unref, reactive, computed, watchEffect } from 'vue';

import { isProdMode } from '/@/utils/env';
import { isFunction } from '/@/utils/is';

const dataTransferRef = reactive<any>({});
/**
 * @description: 适用于将drawer独立出去,外面调用
 */
export function useDrawer(): UseDrawerReturnType {
  if (!getCurrentInstance()) {
    throw new Error('Please put useDrawer function in the setup function!');
  }
  const drawerRef = ref<DrawerInstance | null>(null);
  const loadedRef = ref<boolean | null>(false);
  const uidRef = ref<string>('');

  function getDrawer(drawerInstance: DrawerInstance, uuid: string) {
    uidRef.value = uuid;
    isProdMode() &&
      onUnmounted(() => {
        drawerRef.value = null;
        loadedRef.value = null;
        dataTransferRef[unref(uidRef)] = null;
      });
    if (unref(loadedRef) && isProdMode() && drawerInstance === unref(drawerRef)) {
      return;
    }
    drawerRef.value = drawerInstance;
    loadedRef.value = true;
  }

  const getInstance = () => {
    const instance = unref(drawerRef);
    if (!instance) {
      throw new Error('instance is undefined!');
    }
    return instance;
  };

  const methods: ReturnMethods = {
    setDrawerProps: (props: Partial<DrawerProps>): void => {
      getInstance().setDrawerProps(props);
    },

    openDrawer: (visible = true): void => {
      getInstance().setDrawerProps({
        visible: visible,
      });
    },

    transferDrawerData(val: any) {
      dataTransferRef[unref(uidRef)] = val;
    },
  };

  return [getDrawer, methods];
}
export const useDrawerInner = (callbackFn?: Fn): UseDrawerInnerReturnType => {
  const drawerInstanceRef = ref<DrawerInstance | null>(null);
  const currentInstall = getCurrentInstance();
  const uidRef = ref<string>('');

  if (!currentInstall) {
    throw new Error('instance is undefined!');
  }

  const getInstance = () => {
    const instance = unref(drawerInstanceRef);
    if (!instance) {
      throw new Error('instance is undefined!');
    }
    return instance;
  };

  const register = (modalInstance: DrawerInstance, uuid: string) => {
    uidRef.value = uuid;
    drawerInstanceRef.value = modalInstance;
    currentInstall.emit('register', modalInstance);
  };

  watchEffect(() => {
    const data = dataTransferRef[unref(uidRef)];
    if (!data) return;
    if (!callbackFn || !isFunction(callbackFn)) return;
    callbackFn(data);
  });

  return [
    register,
    {
      receiveDrawerDataRef: computed(() => {
        return dataTransferRef[unref(uidRef)];
      }),

      changeLoading: (loading = true) => {
        getInstance().setDrawerProps({ loading });
      },

      changeOkLoading: (loading = true) => {
        getInstance().setDrawerProps({ confirmLoading: loading });
      },

      closeDrawer: () => {
        getInstance().setDrawerProps({ visible: false });
      },

      setDrawerProps: (props: Partial<DrawerProps>) => {
        getInstance().setDrawerProps(props);
      },
    },
  ];
};
