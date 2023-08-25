import { createVNode, VNode, defineComponent, h, render, reactive } from 'vue';
import { PromptProps, genFormSchemas } from './state';
import Dialog from './dialog.vue';

export function createPrompt(props: PromptProps) {
  let vm: Nullable<VNode> = null;
  const data = reactive({
    ...props,
    addFormSchemas: genFormSchemas({
      label: props.label,
      required: props.required,
      inputType: props.inputType,
      defaultValue: props.defaultValue,
    }),
  });
  const DialogWrap = defineComponent({
    render() {
      return h(Dialog, { ...data } as any);
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
