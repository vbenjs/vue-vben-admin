import type { ColEx } from '../types';
import type { AdvanceState } from '../types/hooks';
import {
  ComputedRef,
  getCurrentInstance,
  Ref,
  shallowReactive,
  computed,
  unref,
  watch,
  nextTick,
} from 'vue';
import type { FormProps, FormSchemaInner as FormSchema } from '../types/form';
import { isBoolean, isFunction, isNumber, isObject } from '@/utils/is';
import { useBreakpoint } from '@/hooks/event/useBreakpoint';
import { useDebounceFn } from '@vueuse/core';

const BASIC_COL_LEN = 24;

interface UseAdvancedContext {
  advanceState: AdvanceState;
  emit: EmitType;
  getProps: ComputedRef<FormProps>;
  getSchema: ComputedRef<FormSchema[]>;
  formModel: Recordable;
  defaultValueRef: Ref<Recordable>;
}

export default function ({
  advanceState,
  emit,
  getProps,
  getSchema,
  formModel,
  defaultValueRef,
}: UseAdvancedContext) {
  const vm = getCurrentInstance();

  const { realWidthRef, screenEnum, screenRef } = useBreakpoint();

  const getEmptySpan = computed((): number => {
    if (!advanceState.isAdvanced) {
      return 0;
    }
    // For some special cases, you need to manually specify additional blank lines
    const emptySpan = unref(getProps).emptySpan || 0;

    if (isNumber(emptySpan)) {
      return emptySpan;
    }
    if (isObject(emptySpan)) {
      const { span = 0 } = emptySpan;
      const screen = unref(screenRef) as string;

      const screenSpan = (emptySpan as any)[screen.toLowerCase()];
      return screenSpan || span || 0;
    }
    return 0;
  });

  // const debounceUpdateAdvanced = useDebounceFn(updateAdvanced, 30);

  watch(
    [() => unref(getSchema), () => advanceState.isAdvanced, () => unref(realWidthRef)],
    () => {
      const { showAdvancedButton } = unref(getProps);
      if (showAdvancedButton) {
        // debounceUpdateAdvanced();
        nextTick(() => {
          updateAdvanced();
        });
      }
    },
    { immediate: true },
  );

  function getAdvanced(itemCol: Partial<ColEx>, itemColSum = 0, isLastAction = false) {
    const width = unref(realWidthRef);

    const mdWidth =
      parseInt(itemCol.md as string) ||
      parseInt(itemCol.xs as string) ||
      parseInt(itemCol.sm as string) ||
      (itemCol.span as number) ||
      BASIC_COL_LEN;

    const lgWidth = parseInt(itemCol.lg as string) || mdWidth;
    const xlWidth = parseInt(itemCol.xl as string) || lgWidth;
    const xxlWidth = parseInt(itemCol.xxl as string) || xlWidth;
    if (width <= screenEnum.LG) {
      itemColSum += mdWidth;
    } else if (width < screenEnum.XL) {
      itemColSum += lgWidth;
    } else if (width < screenEnum.XXL) {
      itemColSum += xlWidth;
    } else {
      itemColSum += xxlWidth;
    }

    if (isLastAction) {
      advanceState.hideAdvanceBtn = false;
      if (itemColSum <= BASIC_COL_LEN * 2) {
        // When less than or equal to 2 lines, the collapse and expand buttons are not displayed
        advanceState.hideAdvanceBtn = true;
        advanceState.isAdvanced = true;
      } else if (
        itemColSum > BASIC_COL_LEN * 2 &&
        itemColSum <= BASIC_COL_LEN * (unref(getProps).autoAdvancedLine || 3)
      ) {
        advanceState.hideAdvanceBtn = false;

        // More than 3 lines collapsed by default
      } else if (!advanceState.isLoad) {
        advanceState.isLoad = true;
        advanceState.isAdvanced = !advanceState.isAdvanced;
      }
      return { isAdvanced: advanceState.isAdvanced, itemColSum };
    }
    if (itemColSum > BASIC_COL_LEN * (unref(getProps).alwaysShowLines || 1)) {
      return { isAdvanced: advanceState.isAdvanced, itemColSum };
    } else {
      // The first line is always displayed
      return { isAdvanced: true, itemColSum };
    }
  }

  const fieldsIsAdvancedMap = shallowReactive({});

  function updateAdvanced() {
    let itemColSum = 0;
    let realItemColSum = 0;
    const { baseColProps = {} } = unref(getProps);

    for (const schema of unref(getSchema)) {
      const { show, ifShow, colProps } = schema;
      const renderCallbackParams = {
        schema: schema,
        model: formModel,
        field: schema.field,
        values: { ...unref(defaultValueRef), ...formModel },
      };
      let isShow = true;
      isShow && isBoolean(ifShow) && (isShow = ifShow);
      isShow && isFunction(ifShow) && (isShow = ifShow(renderCallbackParams));
      isShow && isBoolean(show) && (isShow = show);
      isShow && isFunction(show) && (isShow = show(renderCallbackParams));

      if (isShow && (colProps || baseColProps)) {
        const { itemColSum: sum, isAdvanced } = getAdvanced(
          { ...baseColProps, ...colProps },
          itemColSum,
        );

        itemColSum = sum || 0;
        if (isAdvanced) {
          realItemColSum = itemColSum;
        }
        fieldsIsAdvancedMap[schema.field] = isAdvanced;
      }
    }

    // 确保页面发送更新
    vm?.proxy?.$forceUpdate();

    advanceState.actionSpan = (realItemColSum % BASIC_COL_LEN) + unref(getEmptySpan);

    getAdvanced(unref(getProps).actionColOptions || { span: BASIC_COL_LEN }, itemColSum, true);

    emit('advanced-change', advanceState.isAdvanced);
  }

  function handleToggleAdvanced() {
    advanceState.isAdvanced = !advanceState.isAdvanced;
  }

  return { handleToggleAdvanced, fieldsIsAdvancedMap };
}
