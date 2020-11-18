import { toRef, Ref, reactive, customRef, SetupContext, watch, UnwrapRef } from 'vue';

export type ModelProps<U> = Readonly<
  { [props: string]: any } & {
    modelValue?: U;
  }
>;

export function useModel<T>(
  props: ModelProps<T>,
  context: SetupContext,
  callback?: (val: T | undefined, internalState: { value: UnwrapRef<T | undefined> }) => any
) {
  const outerModel: Ref<T | undefined> = toRef(props, 'modelValue');
  const internalState = reactive({
    value: props.modelValue,
  });

  const internalModel = customRef<UnwrapRef<T> | undefined>((track, trigger) => {
    return {
      get() {
        track();
        return internalState.value;
      },
      set(newVal) {
        if (internalState.value === newVal) return;
        internalState.value = newVal;
        context.emit('update:modelValue', newVal);
        trigger();
      },
    };
  });

  watch(outerModel, (val, oldVal) => {
    if (val === oldVal || val === internalState.value) return;
    if (callback) {
      callback(val, internalState);
      return;
    }
    internalState.value = val as UnwrapRef<T> | undefined;
  });

  return {
    internalState,
    internalModel,
  };
}
