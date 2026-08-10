import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';

import type { FormLabelWidthContext } from '../types';

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  toValue,
  watch,
} from 'vue';

import { isString } from '@vben-core/shared/utils';

import { useResizeObserver } from '@vueuse/core';

export function useFormLabelWidth() {
  const potentialLabelWidthArr = ref<number[]>([]);

  const autoLabelWidth = computed(() => {
    if (potentialLabelWidthArr.value.length === 0) return '0';
    const max = Math.max(...potentialLabelWidthArr.value);
    return max ? `${max}px` : '';
  });

  function getLabelWidthIndex(width: number) {
    const index = potentialLabelWidthArr.value.indexOf(width);
    if (index === -1 && autoLabelWidth.value === '0') {
      console.warn(`unexpected width ${width}`);
    }
    return index;
  }

  function registerLabelWidth(val: number, oldVal: number) {
    if (val && oldVal) {
      const index = getLabelWidthIndex(oldVal);
      potentialLabelWidthArr.value.splice(index, 1, val);
    } else if (val) {
      potentialLabelWidthArr.value.push(val);
    }
  }

  function deregisterLabelWidth(val: number) {
    const index = getLabelWidthIndex(val);
    if (index > -1) {
      potentialLabelWidthArr.value.splice(index, 1);
    }
  }

  return {
    autoLabelWidth,
    registerLabelWidth,
    deregisterLabelWidth,
  };
}

export interface ResolveLabelStyleInput {
  autoLabelWidth: string;
  computedWidth: number;
  isVertical: boolean;
  labelClass: string | undefined;
  labelWidth: number | string | undefined;
}

export function resolveLabelStyle(
  input: ResolveLabelStyleInput,
): Record<string, string> {
  const { labelWidth, labelClass, isVertical, autoLabelWidth, computedWidth } =
    input;

  if (labelClass?.includes('w-') || isVertical) {
    return {};
  }

  if (labelWidth === 'auto' && autoLabelWidth) {
    const marginWidth = Math.max(
      0,
      Number.parseInt(autoLabelWidth, 10) - computedWidth,
    );
    const labelPosition = labelClass === 'justify-start' ? 'left' : 'right';
    const marginPosition =
      labelPosition === 'left' ? 'marginRight' : 'marginLeft';
    return {
      width: 'auto',
      [marginPosition]: `${marginWidth}px`,
    };
  }

  return {
    width: isString(labelWidth) ? labelWidth : `${labelWidth}px`,
  };
}

export function useFieldLabelWidth(options: {
  isVertical: ComputedRef<boolean> | Ref<boolean>;
  labelClass: MaybeRefOrGetter<string | undefined>;
  labelWidth: MaybeRefOrGetter<number | string | undefined>;
  labelWidthContext: FormLabelWidthContext;
}) {
  const { labelWidthContext, isVertical } = options;
  const labelRef = ref();
  const computedWidth = ref(0);

  const labelStyle = computed(() =>
    resolveLabelStyle({
      labelWidth: toValue(options.labelWidth),
      labelClass: toValue(options.labelClass),
      isVertical: isVertical.value,
      autoLabelWidth: labelWidthContext.autoLabelWidth,
      computedWidth: computedWidth.value,
    }),
  );

  const getLabelWidth = () => {
    if (labelRef.value?.$el) {
      const width = window.getComputedStyle(labelRef.value.$el).width;
      return Math.ceil(Number.parseFloat(width));
    }
    return 0;
  };

  const updateLabelWidth = (action: 'remove' | 'update' = 'update') => {
    nextTick(() => {
      if (toValue(options.labelWidth) !== 'auto') {
        return;
      }
      if (action === 'update') {
        computedWidth.value = getLabelWidth();
      } else if (action === 'remove') {
        labelWidthContext.deregisterLabelWidth(computedWidth.value);
      }
    });
  };

  const updateLabelWidthFn = () => updateLabelWidth('update');

  onMounted(updateLabelWidthFn);
  onBeforeUnmount(() => updateLabelWidth('remove'));
  onUpdated(updateLabelWidthFn);

  watch(computedWidth, (val, oldVal) => {
    if (!isVertical.value && toValue(options.labelWidth) === 'auto') {
      labelWidthContext.registerLabelWidth(val, oldVal);
    }
  });

  watch(isVertical, (vertical) => {
    if (toValue(options.labelWidth) !== 'auto' || computedWidth.value === 0) {
      return;
    }
    if (vertical) {
      labelWidthContext.deregisterLabelWidth(computedWidth.value);
    } else {
      labelWidthContext.registerLabelWidth(computedWidth.value, 0);
    }
  });

  useResizeObserver(
    computed(() => (labelRef.value?.$el ?? null) as HTMLElement | null),
    updateLabelWidthFn,
  );

  return {
    labelRef,
    labelStyle,
  };
}
