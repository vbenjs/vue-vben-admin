import type { InjectionKey, Ref } from 'vue';
import { createContext, useContext } from '/@/hooks/core/useContext';
import mitt from '/@/utils/mitt';

export interface SimpleRootMenuContextProps {
  rootMenuEmitter: typeof mitt;
  activeName: Ref<string | number>;
}

const key: InjectionKey<SimpleRootMenuContextProps> = Symbol();

export function createSimpleRootMenuContext(context: SimpleRootMenuContextProps) {
  return createContext<SimpleRootMenuContextProps>(context, key, { readonly: false, native: true });
}

export function useSimpleRootMenuContext() {
  return useContext<SimpleRootMenuContextProps>(key);
}
