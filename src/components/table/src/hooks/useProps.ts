/*
 * @description:
 * @author: wenbin.chen
 * @Date: 2020-05-12 13:20:26
 * @LastEditors: wenbin.chen
 * @LastEditTime: 2020-06-10 16:05:20
 * @email: 190848757@qq.com
 */

import { Ref, ref, watch, unref } from '@vue/composition-api';
import { BasicTableProps } from '../types/table';

/**
 * @description:
 * @Date: 2020-05-12 13:20:37
 */
export function useProps(props: Readonly<Ref<BasicTableProps>>) {
  const propsRef = ref<BasicTableProps>(unref(props)) as Ref<BasicTableProps>;
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
