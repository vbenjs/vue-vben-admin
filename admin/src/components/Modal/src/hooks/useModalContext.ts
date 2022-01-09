import { InjectionKey } from 'vue'
import { createContext, useContext } from '@admin/use'

export interface ModalContextProps {
  redoModalHeight: () => void
}

const key: InjectionKey<ModalContextProps> = Symbol()

export function createModalContext(context: ModalContextProps) {
  return createContext<ModalContextProps>(context, key)
}

export function useModalContext() {
  return useContext<ModalContextProps>(key)
}
