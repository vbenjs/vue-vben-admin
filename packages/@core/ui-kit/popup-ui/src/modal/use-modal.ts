import type { Component, DefineComponent, EmitsOptions } from 'vue';

import type { ExtendedModalApi, ModalApiOptions, ModalProps } from './modal';

import {
  defineComponent,
  h,
  inject,
  nextTick,
  provide,
  reactive,
  ref,
} from 'vue';

import { useStore } from '@vben-core/shared/store';

import { ModalApi } from './modal-api';
import VbenModal from './modal.vue';

const USER_MODAL_INJECT_KEY = Symbol('VBEN_MODAL_INJECT');

const DEFAULT_MODAL_PROPS: Partial<ModalProps> = {};

export function setDefaultModalProps(props: Partial<ModalProps>) {
  Object.assign(DEFAULT_MODAL_PROPS, props);
}

// overload: with connected component -> inherit its props/emits; payload typed
export function useVbenModal<
  TPayload = Record<string, any>,
  TConnected extends Component = any,
>(
  options: ModalApiOptions<TConnected> & { connectedComponent: TConnected },
): [TConnected, ExtendedModalApi<TPayload>];
// overload: without connected component -> default Modal props; payload typed
export function useVbenModal<TPayload = Record<string, any>>(
  options?: ModalApiOptions,
): [
  DefineComponent<ModalProps, any, any, any, any, any, any, EmitsOptions>,
  ExtendedModalApi<TPayload>,
];
export function useVbenModal<
  TPayload = Record<string, any>,
  TConnected extends Component = Component,
>(options: ModalApiOptions<TConnected> = {}) {
  // Modal一般会抽离出来，所以如果有传入 connectedComponent，则表示为外部调用，与内部组件进行连接
  // 外部的Modal通过provide/inject传递api

  const { connectedComponent } = options;
  if (connectedComponent) {
    const extendedApi = reactive({}) as ExtendedModalApi<TPayload>;
    const isModalReady = ref(true);
    const Modal = defineComponent(
      (props: any, { attrs, slots }) => {
        provide(USER_MODAL_INJECT_KEY, {
          extendApi(api: ExtendedModalApi<TPayload>) {
            // 不能直接给 reactive 赋值，会丢失响应
            // 不能用 Object.assign,会丢失 api 的原型函数
            Object.setPrototypeOf(extendedApi, api);
          },
          consumed: false,
          options,
          async reCreateModal() {
            isModalReady.value = false;
            await nextTick();
            isModalReady.value = true;
          },
        });
        checkProps(extendedApi as ExtendedModalApi, {
          ...(props as Record<string, any>),
          ...(attrs as Record<string, any>),
          ...(slots as unknown as Record<string, any>),
        });
        return () =>
          h(
            isModalReady.value ? connectedComponent : 'div',
            {
              ...props,
              ...attrs,
            },
            slots,
          );
      },
      // eslint-disable-next-line vue/one-component-per-file
      {
        name: 'VbenParentModal',
        inheritAttrs: false,
      },
    );

    return [
      Modal as unknown as TConnected,
      extendedApi as ExtendedModalApi<TPayload>,
    ] as const;
  }

  let injectData = inject<any>(USER_MODAL_INJECT_KEY, {});
  // 这个数据已经被使用了，说明这个弹窗是嵌套的弹窗，不应该merge上层的配置
  if (injectData.consumed) {
    injectData = {};
  } else {
    injectData.consumed = true;
  }

  const mergedOptions = {
    ...DEFAULT_MODAL_PROPS,
    ...injectData.options,
    ...options,
  } as ModalApiOptions;

  mergedOptions.onOpenChange = (isOpen: boolean) => {
    options.onOpenChange?.(isOpen);
    injectData.options?.onOpenChange?.(isOpen);
  };

  const onClosed = mergedOptions.onClosed;
  mergedOptions.onClosed = () => {
    onClosed?.();
    if (mergedOptions.destroyOnClose) {
      injectData.consumed = false;
      injectData.reCreateModal?.();
    }
  };

  const api = new ModalApi<TPayload>(mergedOptions);

  const extendedApi: ExtendedModalApi<TPayload> = api as never;

  extendedApi.useStore = (selector) => {
    return useStore(api.store, selector);
  };

  const Modal = defineComponent(
    (props: ModalProps, { attrs, slots }) => {
      return () =>
        h(
          VbenModal,
          {
            ...props,
            ...attrs,
            modalApi: extendedApi,
          },
          slots,
        );
    },
    // eslint-disable-next-line vue/one-component-per-file
    {
      name: 'VbenModal',
      inheritAttrs: false,
    },
  );
  injectData.extendApi?.(extendedApi);

  return [Modal, extendedApi] as const;
}

async function checkProps(api: ExtendedModalApi, attrs: Record<string, any>) {
  if (!attrs || Object.keys(attrs).length === 0) {
    return;
  }
  await nextTick();

  const state = api?.store?.state;

  if (!state) {
    return;
  }

  const stateKeys = new Set(Object.keys(state));

  for (const attr of Object.keys(attrs)) {
    if (stateKeys.has(attr) && !['class'].includes(attr)) {
      // connectedComponent存在时，不要传入Modal的props，会造成复杂度提升，如果你需要修改Modal的props，请使用 useModal 或者api
      console.warn(
        `[Vben Modal]: When 'connectedComponent' exists, do not set props or slots '${attr}', which will increase complexity. If you need to modify the props of Modal, please use useVbenModal or api.`,
      );
    }
  }
}
