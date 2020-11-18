import { ref, watch, Ref, SetupContext } from 'vue';

export function useToggle(internalModel: Ref<unknown>, { emit }: SetupContext) {
  const isActive = ref(!!internalModel.value);
  const isToggled = ref(false);
  watch(internalModel, (val) => {
    isActive.value = !!val;
  });
  watch(isActive, (value) => {
    !!value !== !!internalModel.value && emit('onUpdate:modelValue', value);
  });
  function toggleIt() {
    isToggled.value = !isToggled.value;
  }
  return {
    isActive,
    toggleIt,
    isToggled,
  };
}
