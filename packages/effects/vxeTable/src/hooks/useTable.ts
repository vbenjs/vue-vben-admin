import type { VbenTableProps } from '../type';

import { ref, unref, warn } from 'vue';

export interface tableMethod {
  reload: () => void;
  setProps: (props: VbenTableProps) => void;
}

// eslint-ignore

export function useTable(props: VbenTableProps): [any, tableMethod] {
  const tableRef = ref<tableMethod>(null);

  function register(instance) {
    tableRef.value = instance;
    props && instance.setProps(props);
  }
  function getInstance(): tableMethod {
    const table = unref(tableRef);
    if (!table) {
      warn('表格实例不存在');
    }
    return table as tableMethod;
  }
  const methods: tableMethod = {
    reload: () => getInstance().reload(),
    setProps: (props) => getInstance().setProps(props),
  };
  return [register, methods];
}
