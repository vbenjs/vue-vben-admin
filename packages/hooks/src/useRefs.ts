import { type ComponentPublicInstance, onBeforeUpdate, type Ref, shallowRef } from 'vue';

type SetRefsFunctionRef = Element | ComponentPublicInstance | null;

interface SetRefsFunction {
  (ref: SetRefsFunctionRef, refs: Record<string, any>): void;
}

/**
 * @description 用于模版循环获取 refs
 * <div :ref="setRefs(index)"></div>
 * @returns
 */
function useRefs(): {
  refs: Ref<HTMLElement[]>;
  setRefs: (index: number) => SetRefsFunction;
} {
  const refs = shallowRef([]) as Ref<HTMLElement[]>;

  onBeforeUpdate(() => {
    refs.value = [];
  });

  const setRefs = (index: number) => (ref: SetRefsFunctionRef, refs: Record<string, any>) => {
    refs.value[index] = ref;
  };

  return {
    refs,
    setRefs,
  };
}

export { useRefs };
