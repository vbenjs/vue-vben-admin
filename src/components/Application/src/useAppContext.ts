import { createContext, useContext } from '@vben/hooks';
import { InjectionKey, Ref } from 'vue';

export interface AppProviderContextProps {
  prefixCls: Ref<string>;
  isMobile: Ref<boolean>;
}

const key: InjectionKey<AppProviderContextProps> = Symbol();

export function createAppProviderContext(context: AppProviderContextProps) {
  return createContext<AppProviderContextProps>(key, context);
}

export function useAppProviderContext() {
  return useContext<AppProviderContextProps>(key);
}
