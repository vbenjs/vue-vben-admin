import { provide, inject } from 'vue';

const key = Symbol('basic-modal');

export function provideModal(redoHeight: Fn) {
  provide(key, redoHeight);
}

export function injectModal(): Fn {
  return inject(key, () => {}) as Fn;
}
