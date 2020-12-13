import { InjectionKey, Ref } from 'vue';
import { createContext, useContext } from '/@/hooks/core/useContext';

export interface LayoutContextProps {
  fullHeader: Ref<ComponentRef>;
  isMobile: Ref<boolean>;
}

const key: InjectionKey<LayoutContextProps> = Symbol();

export function createLayoutContext(context: LayoutContextProps) {
  return createContext<LayoutContextProps>(context, key);
}

export function useLayoutContext() {
  return useContext<LayoutContextProps>(key);
}
