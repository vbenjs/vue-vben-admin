import type {
  UseModalReturnType,
  ModalMethods,
  ModalProps,
  ReturnMethods,
  UseModalInnerReturnType,
} from './types';

import {
  ref,
  onUnmounted,
  unref,
  getCurrentInstance,
  reactive,
  watchEffect,
  nextTick,
  toRaw,
} from 'vue';
import { isProdMode } from '/@/utils/env';
import { isFunction } from '/@/utils/is';
import { isEqual } from 'lodash-es';
import { tryOnUnmounted } from '/@/utils/helper/vueHelper';
const dataTransferRef = reactive<any>({});

/**
 * @description: Applicable to independent modal and call outside
 */
export function useModal(): UseModalReturnType {
  if (!getCurrentInstance()) {
    throw new Error('Please put useModal function in the setup function!');
  }
  const modalRef = ref<Nullable<ModalMethods>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);
  const uidRef = ref<string>('');

  function register(modalMethod: ModalMethods, uuid: string) {
    uidRef.value = uuid;

    isProdMode() &&
      onUnmounted(() => {
        modalRef.value = null;
        loadedRef.value = false;
        dataTransferRef[unref(uidRef)] = null;
      });
    if (unref(loadedRef) && isProdMode() && modalMethod === unref(modalRef)) return;

    modalRef.value = modalMethod;
  }

  const getInstance = () => {
    const instance = unref(modalRef);
    if (!instance) {
      throw new Error('instance is undefined!');
    }
    return instance;
  };

  const methods: ReturnMethods = {
    setModalProps: (props: Partial<ModalProps>): void => {
      getInstance().setModalProps(props);
    },

    openModal: <T = any>(visible = true, data?: T, openOnSet = true): void => {
      getInstance().setModalProps({
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

export const useModalInner = (callbackFn?: Fn): UseModalInnerReturnType => {
  const modalInstanceRef = ref<Nullable<ModalMethods>>(null);
  const currentInstall = getCurrentInstance();
  const uidRef = ref<string>('');

  if (!currentInstall) {
    throw new Error('instance is undefined!');
  }

  // currentInstall.type.emits = [...currentInstall.type.emits, 'register'];
  // Object.assign(currentInstall.type.emits, ['register']);

  const getInstance = () => {
    const instance = unref(modalInstanceRef);
    if (!instance) {
      throw new Error('instance is undefined!');
    }
    return instance;
  };

  const register = (modalInstance: ModalMethods, uuid: string) => {
    isProdMode() &&
      tryOnUnmounted(() => {
        modalInstanceRef.value = null;
      });
    uidRef.value = uuid;
    modalInstanceRef.value = modalInstance;
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
        getInstance().setModalProps({ loading });
      },

      changeOkLoading: (loading = true) => {
        getInstance().setModalProps({ confirmLoading: loading });
      },

      closeModal: () => {
        getInstance().setModalProps({ visible: false });
      },

      setModalProps: (props: Partial<ModalProps>) => {
        getInstance().setModalProps(props);
      },
    },
  ];
};
