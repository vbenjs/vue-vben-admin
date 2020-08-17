import { isBoolean } from '@/utils/is/index';
import { UseModalReturnType, ModalInstance, ModalProps, ReturnMethods } from './types';
import { ref, getCurrentInstance, onUnmounted, unref } from 'compatible-vue';

import { isProdMode } from '@/utils/envUtil';

/**
 * @description: 适用于将modal独立出去,外面调用
 */
export function useModal(): UseModalReturnType {
  if (!getCurrentInstance()) {
    throw new Error('Please put useModal function in the setup function!');
  }
  const modalRef = ref<ModalInstance | null>(null);
  const loadedRef = ref<boolean | null>(false);
  // const isFirstLoadRef = ref<boolean | null>(true);
  // const innerPropsRef = ref<Partial<ModalProps> | null>(null);

  function register(modalInstance: ModalInstance) {
    onUnmounted(() => {
      modalRef.value = null;
      loadedRef.value = false;
      // isFirstLoadRef.value = null;
      // innerPropsRef.value = null;
    });
    if (unref(loadedRef) && isProdMode()) {
      return;
    }
    modalRef.value = modalInstance;
    // loadedRef.value = true;

    // unref(modalRef)!.setModalProps((unref(innerPropsRef) as Partial<ModalProps>) || {});
  }
  const methods: ReturnMethods = {
    /**
     * @description: 设置modal参数
     */
    setModalProps: (props: Partial<ModalProps>): void => {
      unref(modalRef)!.setModalProps(props);
    },
    isFirstLoadRef: ref(true),
    openModal: (props: Partial<ModalProps> | boolean): void => {
      // if (unref(isFirstLoadRef)) {
      //   isFirstLoadRef.value = false;
      //   innerPropsRef.value = props;
      // } else {
      const modal = unref(modalRef);
      if (!modal) {
        return;
      }
      if (isBoolean(props)) {
        modal.setModalProps({
          visible: props,
        });
      } else {
        modal.setModalProps(props);
      }
      // }
    },
  };
  return [register, methods];
}

export const useModalExt = (emit: (event: string, ...args: any[]) => void) => {
  const modalInstanceRef = ref<ModalInstance | null>(null);
  return {
    register: (modalInstance: ModalInstance) => {
      modalInstanceRef.value = modalInstance;
      emit('register', modalInstance);
    },
    modalInstanceRef,
  };
};
/**
 * @description: 外部独立组件内使用
 */
export const useModalOnInner = () => {
  const visibleRef = ref(false);
  const confirmLoadingRef = ref(false);
  const wrapperLoadingRef = ref(false);

  const hiddenModal = () => {
    visibleRef.value = false;
  };
  const showModal = () => {
    visibleRef.value = true;
  };

  return {
    visibleRef,
    confirmLoadingRef,
    wrapperLoadingRef,
    hiddenModal,
    showModal,
  };
};
