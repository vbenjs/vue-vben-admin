import { createStorage } from '/@/utils/storage';

export function useLocalStorage() {
  return createStorage(localStorage);
}
