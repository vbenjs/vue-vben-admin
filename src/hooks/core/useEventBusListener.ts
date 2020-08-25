import { onMounted, onUnmounted } from 'compatible-vue';
import eventBus from '@/utils/eventBus';

export function useEventBusListener(eventName: string, handler: Fn) {
  onMounted(() => eventBus.$on(eventName, handler));
  onUnmounted(() => eventBus.$off(eventName, handler));
}
