import { defineComponent, h } from 'vue';

export const TestInput = defineComponent({
  inheritAttrs: false,
  emits: ['update:modelValue'],
  setup(_props, { attrs, emit }) {
    function handleInput(event: Event) {
      const target = event.target;
      if (target instanceof HTMLInputElement) {
        emit('update:modelValue', target.value);
      }
    }

    return () =>
      h('input', {
        ...attrs,
        onInput: handleInput,
        value: attrs.modelValue ?? '',
      });
  },
});
