import { createContext, useContext } from '@vben/hooks';
import { InjectionKey } from 'vue';

export interface ModalContextProps {
  redoModalHeight: () => void;
}

const key: InjectionKey<ModalContextProps> = Symbol();

export function createModalContext(context: ModalContextProps) {
  return createContext<ModalContextProps>(key, context);
}

export function useModalContext() {
  return useContext<ModalContextProps>(key);
}
