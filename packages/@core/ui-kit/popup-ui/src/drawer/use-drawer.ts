import type { Component } from 'vue';

import type {
  DrawerApiOptions,
  DrawerProps,
  ExtendedDrawerApi,
  InferDrawerData,
} from './drawer';

import {
  defineComponent,
  h,
  inject,
  markRaw,
  nextTick,
  onBeforeUnmount,
  provide,
  ref,
  shallowReactive,
} from 'vue';

import { usePreferences } from '@vben-core/preferences';
import { useSelector } from '@vben-core/shared/store';

import { DrawerApi } from './drawer-api';
import VbenDrawer from './drawer.vue';

const USER_DRAWER_INJECT_KEY = Symbol('VBEN_DRAWER_INJECT');

declare const DRAWER_DATA_NOT_PROVIDED: unique symbol;

type DrawerDataNotProvided = {
  readonly [DRAWER_DATA_NOT_PROVIDED]: true;
};

type ResolvedDrawerData<
  TData,
  TConnectedComponent extends Component,
> = TData extends DrawerDataNotProvided
  ? InferDrawerData<TConnectedComponent>
  : TData;

interface DrawerInjectData<TData> {
  consumed?: boolean;
  extendApi?: (api: ExtendedDrawerApi<TData>) => void;
  options?: DrawerApiOptions;
  reCreateDrawer?: () => Promise<void>;
}

const { globalEscapeShortcutKey } = usePreferences();

/**
 * 默认配置
 */
const DEFAULT_DRAWER_PROPS: Partial<DrawerProps> = {};

export function setDefaultDrawerProps(props: Partial<DrawerProps>) {
  Object.assign(DEFAULT_DRAWER_PROPS, props);
}

export function useVbenDrawer<
  TData = DrawerDataNotProvided,
  TConnectedComponent extends Component = Component,
>(options: DrawerApiOptions<TConnectedComponent> = {}) {
  type TResolvedData = ResolvedDrawerData<TData, TConnectedComponent>;

  // Drawer一般会抽离出来，所以如果有传入 connectedComponent，则表示为外部调用，与内部组件进行连接
  // 外部的Drawer通过provide/inject传递api

  const defaultOptions = {
    closeOnPressEscape: globalEscapeShortcutKey.value, // 全局Esc快捷键配置
    ...options,
  };
  const { connectedComponent } = options;
  if (connectedComponent) {
    const extendedApi = shallowReactive({}) as ExtendedDrawerApi<TResolvedData>;
    const isDrawerReady = ref(true);
    const Drawer = defineComponent(
      (props: DrawerProps, { attrs, slots }) => {
        function rebindApi(api: ExtendedDrawerApi<TResolvedData>) {
          Object.setPrototypeOf(extendedApi, markRaw(api));
        }

        provide(USER_DRAWER_INJECT_KEY, {
          extendApi: rebindApi,
          consumed: false,
          options: defaultOptions,
          async reCreateDrawer() {
            isDrawerReady.value = false;
            await nextTick();
            isDrawerReady.value = true;
          },
        });
        checkProps(extendedApi, {
          ...props,
          ...attrs,
          ...slots,
        });
        return () =>
          h(
            isDrawerReady.value ? connectedComponent : 'div',
            { ...props, ...attrs },
            slots,
          );
      },
      // eslint-disable-next-line vue/one-component-per-file
      {
        name: 'VbenParentDrawer',
        inheritAttrs: false,
      },
    );

    return [Drawer, extendedApi] as const;
  }

  const injectData = inject<DrawerInjectData<TResolvedData>>(
    USER_DRAWER_INJECT_KEY,
    {},
  );
  const isConsumed = injectData.consumed;
  const effectiveOptions = isConsumed ? {} : injectData.options;
  if (!isConsumed && injectData.consumed !== undefined) {
    injectData.consumed = true;
  }
  onBeforeUnmount(() => {
    if (!isConsumed && injectData.consumed !== undefined) {
      injectData.consumed = false;
    }
  });

  const mergedOptions = {
    ...DEFAULT_DRAWER_PROPS,
    ...effectiveOptions,
    ...defaultOptions,
  } as DrawerApiOptions;

  mergedOptions.onOpenChange = (isOpen: boolean) => {
    options.onOpenChange?.(isOpen);
    if (!isConsumed) {
      injectData.options?.onOpenChange?.(isOpen);
    }
  };

  const onClosed = mergedOptions.onClosed;
  mergedOptions.onClosed = () => {
    onClosed?.();
    if (mergedOptions.destroyOnClose && !isConsumed) {
      if (injectData.consumed !== undefined) {
        injectData.consumed = false;
      }
      injectData.reCreateDrawer?.();
    }
  };
  const api = new DrawerApi<TResolvedData>(mergedOptions);

  const extendedApi = api as ExtendedDrawerApi<TResolvedData>;

  extendedApi.useStore = (selector) => {
    return useSelector(api.store, selector);
  };

  const Drawer = defineComponent(
    (props: DrawerProps, { attrs, slots }) => {
      return () =>
        h(VbenDrawer, { ...props, ...attrs, drawerApi: extendedApi }, slots);
    },
    // eslint-disable-next-line vue/one-component-per-file
    {
      name: 'VbenDrawer',
      inheritAttrs: false,
    },
  );
  injectData.extendApi?.(extendedApi);
  return [Drawer, extendedApi] as const;
}

export function createVbenDrawer<TData = unknown>() {
  return function useTypedVbenDrawer<
    TConnectedComponent extends Component = Component,
  >(options: DrawerApiOptions<TConnectedComponent> = {}) {
    return useVbenDrawer<TData, TConnectedComponent>(options);
  };
}

async function checkProps<TData>(
  api: ExtendedDrawerApi<TData>,
  attrs: Record<string, any>,
) {
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
      // connectedComponent存在时，不要传入Drawer的props，会造成复杂度提升，如果你需要修改Drawer的props，请使用 useVbenDrawer 或者api
      console.warn(
        `[Vben Drawer]: When 'connectedComponent' exists, do not set props or slots '${attr}', which will increase complexity. If you need to modify the props of Drawer, please use useVbenDrawer or api.`,
      );
    }
  }
}
