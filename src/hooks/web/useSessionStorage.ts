import { createStorage } from '/@/utils/storage/index';

export function useSessionStorage() {
  return createStorage(sessionStorage);
}
