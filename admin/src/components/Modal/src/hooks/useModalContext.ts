import { InjectionKey } from 'vue'
import { createContext, useContext } from '@vben-admin/hooks'

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
