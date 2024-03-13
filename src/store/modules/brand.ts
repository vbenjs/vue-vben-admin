import { defineStore } from 'pinia';
import { store } from '../index';

export interface BrandOptionState {
  brand;
}

export const useBrandStore = defineStore({
  id: 'app-option',
  state: (): BrandOptionState => ({}),
  getters: {},
  actions: {},
});

// Need to be used outside the setup
export function useBrandStoreWithOut() {
  return useBrandStore(store);
}
