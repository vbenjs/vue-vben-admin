import { onBeforeMount } from 'compatible-vue';
import { createContextMenu, offContextMenu } from '@/components/context-menu';

export function useContextMenu() {
  onBeforeMount(() => {
    offContextMenu();
  });
  return [createContextMenu, offContextMenu];
}
