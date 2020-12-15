import type {
  UseDrawerReturnType,
  DrawerInstance,
  ReturnMethods,
  DrawerProps,
  UseDrawerInnerReturnType,
} from './types';

import { ref, getCurrentInstance, unref, reactive, watchEffect, nextTick, toRaw } from 'vue';

import { isProdMode } from '/@/utils/env';
import { isFunction } from '/@/utils/is';
import { tryOnUnmounted } from '/@/utils/helper/vueHelper';
import { isEqual } from 'lodash-es';

const dataTransferRef = reactive<any>({});

/**
 * @description: Applicable to separate drawer and call outside
 */
export function useDrawer(): UseDrawerReturnType {
  if (!getCurrentInstance()) {
    throw new Error('Please put useDrawer function in the setup function!');
  }

  const drawerRef = ref<DrawerInstance | null>(null);
  const loadedRef = ref<Nullable<boolean>>(false);
  const uidRef = ref<string>('');

  function register(drawerInstance: DrawerInstance, uuid: string) {
    isProdMode() &&
      tryOnUnmounted(() => {
        drawerRef.value = null;
        loadedRef.value = null;
        dataTransferRef[unref(uidRef)] = null;
      });

    if (unref(loadedRef) && isProdMode() && drawerInstance === unref(drawerRef)) {
      return;
    }
    uidRef.value = uuid;
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

    openDrawer: <T = any>(visible = true, data?: T, openOnSet = true): void => {
      getInstance().setDrawerProps({
        visible: visible,
      });
      if (!data) return;

      if (openOnSet) {
        dataTransferRef[unref(uidRef)] = null;
        dataTransferRef[unref(uidRef)] = data;
        return;
      }
      const equal = isEqual(toRaw(dataTransferRef[unref(uidRef)]), data);
      if (!equal) {
        dataTransferRef[unref(uidRef)] = data;
      }
    },
  };

  return [register, methods];
}

export const useDrawerInner = (callbackFn?: Fn): UseDrawerInnerReturnType => {
  const drawerInstanceRef = ref<Nullable<DrawerInstance>>(null);
  const currentInstall = getCurrentInstance();
  const uidRef = ref<string>('');

  if (!currentInstall) {
    throw new Error('useDrawerInner instance is undefined!');
  }

  const getInstance = () => {
    const instance = unref(drawerInstanceRef);
    if (!instance) {
      throw new Error('useDrawerInner instance is undefined!');
    }
    return instance;
  };

  const register = (modalInstance: DrawerInstance, uuid: string) => {
    isProdMode() &&
      tryOnUnmounted(() => {
        drawerInstanceRef.value = null;
      });

    uidRef.value = uuid;
    drawerInstanceRef.value = modalInstance;
    currentInstall.emit('register', modalInstance, uuid);
  };

  watchEffect(() => {
    const data = dataTransferRef[unref(uidRef)];
    if (!data) return;
    if (!callbackFn || !isFunction(callbackFn)) return;
    nextTick(() => {
      callbackFn(data);
    });
  });

  return [
    register,
    {
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
