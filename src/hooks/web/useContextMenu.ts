import { onUnmounted, getCurrentInstance } from 'vue';
import { createContextMenu, unMountedContextMenu } from '/@/components/ContextMenu';
import type { ContextMenuItem } from '/@/components/ContextMenu';
export type { ContextMenuItem };
export function useContextMenu(authRemove = true) {
  if (getCurrentInstance() && authRemove) {
    onUnmounted(() => {
      unMountedContextMenu();
    });
  }
  return [createContextMenu, unMountedContextMenu];
}
