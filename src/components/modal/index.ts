// import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

// export { default as Modal } from './src/Modal.vue';
// export { default as ModalWrapper } from './src/ModalWrapper.vue';
export { default as BasicModal } from './src/BasicModal.vue';

// export const BasicModal = getAsyncComponent(() => import('./src/BasicModal.vue'));
// export const ModalWrapper = getAsyncComponent(() => import('./src/ModalWrapper.vue'));
// export const Modal = getAsyncComponent(() => import('./src/Modal.vue'));

export { useModal, useModalOnInner, useModalExt } from './src/useModal';
export * from './src/types';
