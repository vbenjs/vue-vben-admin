import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  actions: {
    increment() {
      this.count++;
    },
  },
  getters: {
    double: (state) => state.count * 2,
  },
  state: () => ({ count: 0 }),
});
