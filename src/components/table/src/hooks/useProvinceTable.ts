import { provide, inject } from 'compatible-vue';
import { TableInstance } from '../types/table';

const key = Symbol('table');

export function provideTable(instance: TableInstance) {
  provide(key, instance);
}

export function injectTable(): TableInstance {
  return inject(key) as TableInstance;
}
