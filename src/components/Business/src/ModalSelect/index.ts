import { createVNode, VNode, defineComponent, h, render, reactive } from 'vue';
import { SelectTableProps } from './state';
import SelectTableModal from './SelectTableModal.vue';
import SelectTableDrawer from './SelectTableDrawer.vue';

export function createSelectTableModal<T = Recordable>(props: SelectTableProps<T>) {
  let vm: Nullable<VNode> = null;
  const data = reactive({
    ...props,
  });
  const SelectTableModalWrap = defineComponent({
    render() {
      return h(SelectTableModal, { ...data } as any);
    },
  });

  vm = createVNode(SelectTableModalWrap);

  render(vm, document.createElement('div'));

  function close() {
    if (vm?.el && vm.el.parentNode) {
      vm.el.parentNode.removeChild(vm.el);
    }
  }

  return {
    vm,
    close,
    get $el() {
      return vm?.el as HTMLElement;
    },
  };
}

export function createSelectTableDrawer<T = Recordable>(props: SelectTableProps<T>) {
  let vm: Nullable<VNode> = null;
  const data = reactive({
    ...props,
  });
  const SelectTableDrawerWrap = defineComponent({
    render() {
      return h(SelectTableDrawer, { ...data } as any);
    },
  });

  vm = createVNode(SelectTableDrawerWrap);

  render(vm, document.createElement('div'));

  function close() {
    if (vm?.el && vm.el.parentNode) {
      vm.el.parentNode.removeChild(vm.el);
    }
  }

  return {
    vm,
    close,
    get $el() {
      return vm?.el as HTMLElement;
    },
  };
}

export function createSelectTable<T = Recordable>(
  props: SelectTableProps<T>,
  type: 'modal' | 'drawer' = 'modal',
) {
  if (type === 'modal') {
    return createSelectTableModal(props);
  } else if (type === 'drawer') {
    return createSelectTableDrawer(props);
  }
}
