import { InjectionKey } from 'vue';
import { createContext, useContext } from '/@/hooks/core/useContext';

export interface ModalContextProps {
  redoModalHeight: () => void;
}

const modalContextInjectKey: InjectionKey<ModalContextProps> = Symbol();

export function createModalContext(context: ModalContextProps) {
  return createContext<ModalContextProps>(context, modalContextInjectKey);
}

export function useModalContext() {
  return useContext<ModalContextProps>(modalContextInjectKey);
}
