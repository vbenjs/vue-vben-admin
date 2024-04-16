import { useGlobalStore, useGlobalStoreWithOut } from '@/store/modules/gloabal';

/**
 * @description: message
 */
export function useMessage() {
  return useGlobalStore();
}

export function useMessageWithOut() {
  return useGlobalStoreWithOut();
}
