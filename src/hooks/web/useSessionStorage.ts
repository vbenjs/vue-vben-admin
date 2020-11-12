import { createStorage } from '/@/utils/storage';

export function useSessionStorage() {
  return createStorage(sessionStorage);
}
