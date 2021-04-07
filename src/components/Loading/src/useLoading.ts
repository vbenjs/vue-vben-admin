import { unref } from 'vue';
import { createLoading } from './createLoading';
import type { LoadingProps } from './types';
import type { Ref } from 'vue';

export interface UseLoadingOptions {
  target?: HTMLElement | Ref<ElRef>;
  props?: Partial<LoadingProps>;
}

interface Fn {
  (): void;
}

export function useLoading(props: Partial<LoadingProps>): [Fn, Fn];
export function useLoading(opt: Partial<UseLoadingOptions>): [Fn, Fn];

export function useLoading(opt: Partial<LoadingProps> | Partial<UseLoadingOptions>): [Fn, Fn] {
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
    const t = unref(target);
    if (!t) return;
    instance.open(t);
  };

  const close = (): void => {
    instance.close();
  };

  return [open, close];
}
