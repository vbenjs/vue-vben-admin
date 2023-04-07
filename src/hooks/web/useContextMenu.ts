import { getCurrentInstance, onUnmounted } from 'vue';

import type { ContextMenuItem } from '@/components/ContextMenu';
import { createContextMenu, destroyContextMenu } from '@/components/ContextMenu';

export type { ContextMenuItem };
export function useContextMenu(authRemove = true) {
  if (getCurrentInstance() && authRemove) {
    onUnmounted(() => {
      destroyContextMenu();
    });
  }
  return [createContextMenu, destroyContextMenu];
}
