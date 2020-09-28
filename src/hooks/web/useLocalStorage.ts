import { createStorage } from '/@/utils/storage/index';

export function useLocalStorage() {
  return createStorage(localStorage);
}
