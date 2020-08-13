import { onUnmounted, getCurrentInstance } from 'compatible-vue';
import { createContextMenu, offContextMenu, ContextMenuItem } from '@/components/context-menu';

export { ContextMenuItem };
export function useContextMenu(authRemove = true) {
  if (getCurrentInstance() && authRemove) {
    onUnmounted(() => {
      offContextMenu();
    });
  }
  return [createContextMenu, offContextMenu];
}
