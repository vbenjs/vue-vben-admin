<script setup lang="ts">
import { computed, toRaw, unref, watch } from 'vue';

import { useSimpleLocale } from '@vben-core/composables';
import { VbenExpandableArrow } from '@vben-core/shadcn-ui';
import { cn, isFunction, triggerWindowResize } from '@vben-core/shared/utils';

import { COMPONENT_MAP } from '../config';
import { injectFormProps } from '../use-form-context';

const { $t } = useSimpleLocale();

const [rootProps, form] = injectFormProps();

const collapsed = defineModel({ default: false });

const resetButtonOptions = computed(() => {
  return {
    content: `${$t.value('reset')}`,
    show: true,
    ...unref(rootProps).resetButtonOptions,
  };
});

const submitButtonOptions = computed(() => {
  return {
    content: `${$t.value('submit')}`,
    show: true,
    ...unref(rootProps).submitButtonOptions,
  };
});

// const isQueryForm = computed(() => {
//   return !!unref(rootProps).showCollapseButton;
// });

const queryFormStyle = computed(() => {
  if (!unref(rootProps).actionWrapperClass) {
    return {
      'grid-column': `-2 / -1`,
      marginLeft: 'auto',
    };
  }

  return {};
});

async function handleSubmit(e: Event) {
  e?.preventDefault();
  e?.stopPropagation();
  const { valid } = await form.validate();
  if (!valid) {
    return;
  }

  const values = handleRangeTimeValue(toRaw(form.values));
  await unref(rootProps).handleSubmit?.(values);
}

async function handleReset(e: Event) {
  e?.preventDefault();
  e?.stopPropagation();
  const props = unref(rootProps);

  const values = toRaw(form.values);
  // 清理时间字段
  props.fieldMapToTime &&
    props.fieldMapToTime.forEach(([_, [startTimeKey, endTimeKey]]) => {
      delete values[startTimeKey];
      delete values[endTimeKey];
    });

  if (isFunction(props.handleReset)) {
    await props.handleReset?.(values);
  } else {
    form.resetForm();
  }
}

function handleRangeTimeValue(values: Record<string, any>) {
  const fieldMapToTime = unref(rootProps).fieldMapToTime;

  if (!fieldMapToTime) return values;

  if (!Array.isArray(fieldMapToTime)) {
    return values;
  }

  fieldMapToTime.forEach(
    ([field, [startTimeKey, endTimeKey], format = 'YYYY-MM-DD']) => {
      if (!values[field]) {
        delete values[field];
        return;
      }

      const [startTime, endTime] = values[field];
      const [startTimeFormat, endTimeFormat] = Array.isArray(format)
        ? format
        : [format, format];

      values[startTimeKey] = startTime
        ? formatTime(startTime, startTimeFormat)
        : undefined;
      values[endTimeKey] = endTime
        ? formatTime(endTime, endTimeFormat)
        : undefined;

      delete values[field];
    },
  );

  return values;
}

function formatTime(time: string, format: string): number | string {
  const date = new Date(time);
  const timestamp = (date: Date) => Math.floor(date.getTime() / 1000);

  if (format === 'timestamp') return timestamp(date);
  if (format === 'timestampStartDay')
    return timestamp(
      new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    );

  const padZero = (num: number) => num.toString().padStart(2, '0');
  const replacements: Record<string, string> = {
    DD: padZero(date.getDate()),
    HH: padZero(date.getHours()),
    MM: padZero(date.getMonth() + 1),
    mm: padZero(date.getMinutes()),
    ss: padZero(date.getSeconds()),
    YYYY: date.getFullYear().toString(),
  };

  return format.replaceAll(
    /YYYY|MM|DD|HH|mm|ss/g,
    (match) => replacements[match] || match,
  );
}

watch(
  () => collapsed.value,
  () => {
    const props = unref(rootProps);
    if (props.collapseTriggerResize) {
      triggerWindowResize();
    }
  },
);

defineExpose({
  handleReset,
  handleSubmit,
});
</script>
<template>
  <div
    :class="
      cn('col-span-full w-full pb-6 text-right', rootProps.actionWrapperClass)
    "
    :style="queryFormStyle"
  >
    <!-- 重置按钮前 -->
    <slot name="reset-before"></slot>

    <component
      :is="COMPONENT_MAP.DefaultButton"
      v-if="resetButtonOptions.show"
      class="mr-3"
      type="button"
      @click="handleReset"
      v-bind="resetButtonOptions"
    >
      {{ resetButtonOptions.content }}
    </component>

    <!-- 提交按钮前 -->
    <slot name="submit-before"></slot>

    <component
      :is="COMPONENT_MAP.PrimaryButton"
      v-if="submitButtonOptions.show"
      type="button"
      @click="handleSubmit"
      v-bind="submitButtonOptions"
    >
      {{ submitButtonOptions.content }}
    </component>

    <!-- 展开按钮前 -->
    <slot name="expand-before"></slot>

    <VbenExpandableArrow
      v-if="rootProps.showCollapseButton"
      v-model:model-value="collapsed"
      class="ml-2"
    >
      <span>{{ collapsed ? $t('expand') : $t('collapse') }}</span>
    </VbenExpandableArrow>

    <!-- 展开按钮后 -->
    <slot name="expand-after"></slot>
  </div>
</template>
