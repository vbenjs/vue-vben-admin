import { tryOnUnmounted } from '/@/utils/helper/vueHelper';
import EventHub from '/@/utils/eventHub';
const eventHub = new EventHub();
export function useEventHub(): EventHub {
  tryOnUnmounted(() => {
    eventHub.clear();
  });

  return eventHub;
}
