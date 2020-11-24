import { InjectionKey, Ref } from 'vue';
import { createContext, useContext } from '/@/hooks/core/useContext';

export interface LayoutContextProps {
  fullHeaderRef: Ref<ComponentRef>;
}

const layoutContextInjectKey: InjectionKey<LayoutContextProps> = Symbol();

export function createLayoutContext(context: LayoutContextProps) {
  return createContext<LayoutContextProps>(context, layoutContextInjectKey);
}

export function useLayoutContext() {
  return useContext<LayoutContextProps>(layoutContextInjectKey);
}
