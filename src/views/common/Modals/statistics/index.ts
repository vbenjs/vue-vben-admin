import { createVNode, VNode, defineComponent, h, render, reactive } from 'vue';
import { PromptProps } from './state';
import EquipmentStatistics from './EquipmentStatistics.vue';

export function createEquipmentStatistics(props: PromptProps) {
  let vm: Nullable<VNode> = null;
  const data = reactive({
    ...props,
  });
  const DialogWrap = defineComponent({
    render() {
      return h(EquipmentStatistics, { ...data } as any);
    },
  });

  vm = createVNode(DialogWrap);

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
