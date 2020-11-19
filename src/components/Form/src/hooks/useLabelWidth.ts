import type { Ref } from 'vue';
import type { FormProps, FormSchema } from '../types/form';

import { computed, unref } from 'vue';
import { isNumber } from '/@/utils/is';

// export function useGlobalLabelWidth(propsRef: ComputedRef<FormProps>) {
//   return computed(() => {
//     const { labelWidth, labelCol, wrapperCol } = unref(propsRef);
//     if (!labelWidth) {
//       return { labelCol, wrapperCol };
//     }

//     const width = isNumber(labelWidth) ? `${labelWidth}px` : labelWidth;
//     return {
//       labelCol: { style: { width }, span: 1, ...labelCol },
//       wrapperCol: { style: { width: `calc(100% - ${width})` }, span: 23, ...wrapperCol },
//     };
//   });
// }

export function useItemLabelWidth(schemaItemRef: Ref<FormSchema>, propsRef: Ref<FormProps>) {
  return computed((): any => {
    const schemaItem = unref(schemaItemRef);
    const { labelCol = {}, wrapperCol = {} } = schemaItem.itemProps || {};
    const { labelWidth, disabledLabelWidth } = schemaItem;

    const {
      labelWidth: globalLabelWidth,
      labelCol: globalLabelCol,
      wrapperCol: globWrapperCol,
    } = unref(propsRef) as any;

    // If labelWidth is set globally, all items use
    if ((!globalLabelWidth && !labelWidth && !globalLabelCol) || disabledLabelWidth) {
      return { labelCol, wrapperCol };
    }
    let width = labelWidth || globalLabelWidth;
    const col = { ...globalLabelCol, ...labelCol };
    const wrapCol = { ...globWrapperCol, ...wrapperCol };

    if (width) {
      width = isNumber(width) ? `${width}px` : width;
    }
    return {
      labelCol: { style: { width }, ...col },
      wrapperCol: { style: { width: `calc(100% - ${width})` }, ...wrapCol },
    };
  });
}
