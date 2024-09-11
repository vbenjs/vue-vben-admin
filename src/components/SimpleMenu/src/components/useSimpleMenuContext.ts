import { createContext, useContext } from '@/hooks/core/useContext';
import type { Emitter } from '@/utils/mitt';
import type { ComponentInternalInstance, InjectionKey, Ref } from 'vue';

export type MenuEmitterEvents = {
  'on-update-opened':
    | (string | number)[]
    | {
        opened: boolean;
        parent?: ComponentInternalInstance | null;
        uidList: number[];
      };
  'on-menu-item-select': string | number;
  'open-name-change': {
    name: string | number;
    opened: boolean;
  };
  'on-update-active-name:submenu': number[];
};

export interface SimpleRootMenuContextProps {
  rootMenuEmitter: Emitter<MenuEmitterEvents>;
  activeName: Ref<string | number>;
}

const key: InjectionKey<SimpleRootMenuContextProps> = Symbol();

export function createSimpleRootMenuContext(context: SimpleRootMenuContextProps) {
  return createContext<SimpleRootMenuContextProps>(context, key, { readonly: false, native: true });
}

export function useSimpleRootMenuContext() {
  return useContext<SimpleRootMenuContextProps>(key);
}
