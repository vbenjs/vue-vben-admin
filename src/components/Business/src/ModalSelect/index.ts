import { createVNode, VNode, defineComponent, h, render, reactive } from 'vue';
import { SelectModalProps } from './state';
import SelectTableModal from './SelectTableModal.vue';

export function createSelectTableModal(props: SelectModalProps) {
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
