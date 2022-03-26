import { ComponentSizeEnum } from '@pkg/tokens'

export interface LoadingProps {
  tip: string
  size: ComponentSizeEnum
  absolute: boolean
  loading: boolean
  background: string
  theme: 'dark' | 'light'
}
