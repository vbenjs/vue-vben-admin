import { createContext, useContext } from '@vben/hooks';
import type { InjectionKey, Ref } from 'vue';

import type { Emitter } from '@/utils/mitt';

export interface SimpleRootMenuContextProps {
  rootMenuEmitter: Emitter;
  activeName: Ref<string | number>;
}

const key: InjectionKey<SimpleRootMenuContextProps> = Symbol();

export function createSimpleRootMenuContext(context: SimpleRootMenuContextProps) {
  return createContext<SimpleRootMenuContextProps>(key, context, {
    writeable: true,
    reactiveable: false,
  });
}

export function useSimpleRootMenuContext() {
  return useContext<SimpleRootMenuContextProps>(key);
}
