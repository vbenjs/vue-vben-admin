import { Ref, ref, watch, unref } from 'vue';

import type { BasicTableProps } from '../types/table';

/**
 * @description:
 * @Date: 2020-05-12 13:20:37
 */
export function useProps(props: Readonly<Ref<BasicTableProps>>) {
  const propsRef = (ref<BasicTableProps>(unref(props)) as unknown) as Ref<BasicTableProps>;
  watch(
    () => props.value,
    (v) => {
      propsRef.value = unref(v);
    },
    {
      immediate: false,
    }
  );
  return { propsRef };
}
