import { unref } from 'vue';
import type { Ref } from 'vue';
import { tryOnUnmounted } from '@vueuse/core';
import { createLoading } from './createLoading';
import type { LoadingProps } from './typing';

export interface UseLoadingOptions {
  target?: any;
  props?: Partial<LoadingProps>;
}

interface Fn {
  (): void;
}

export function useLoading(props: Partial<LoadingProps>): [Fn, Fn, (string) => void];
export function useLoading(opt: Partial<UseLoadingOptions>): [Fn, Fn, (string) => void];

export function useLoading(
  opt: Partial<LoadingProps> | Partial<UseLoadingOptions>,
): [Fn, Fn, (string) => void] {
  let props: Partial<LoadingProps>;
  let target: HTMLElement | Ref<ElRef> = document.body;

  if (Reflect.has(opt, 'target') || Reflect.has(opt, 'props')) {
    const options = opt as Partial<UseLoadingOptions>;
    props = options.props || {};
    target = options.target || document.body;
  } else {
    props = opt as Partial<LoadingProps>;
  }

  const instance = createLoading(props, undefined, true);

  const open = (): void => {
    const t = unref(target as Ref<ElRef>);
    if (!t) return;
    instance.open(t);
  };

  const close = (): void => {
    instance.close();
  };

  const setTip = (tip: string) => {
    instance.setTip(tip);
  };

  tryOnUnmounted(() => {
    instance.destory();
  });

  return [open, close, setTip];
}
