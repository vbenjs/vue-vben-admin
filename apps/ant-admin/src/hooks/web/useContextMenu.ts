import { onUnmounted, getCurrentInstance } from 'vue'
import {
  createContextMenu,
  destroyContextMenu,
} from '@/components/context-menu'
import type { ContextMenuItem } from '@/components/context-menu'
export type { ContextMenuItem }
export function useContextMenu(authRemove = true) {
  if (getCurrentInstance() && authRemove) {
    onUnmounted(() => {
      destroyContextMenu()
    })
  }
  return [createContextMenu, destroyContextMenu]
}
