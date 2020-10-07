import { provide, inject } from 'vue';
import { TableActionType } from '../types/table';

const key = Symbol('table');

export function provideTable(instance: TableActionType) {
  provide(key, instance);
}

export function injectTable(): TableActionType {
  return inject(key) as TableActionType;
}
