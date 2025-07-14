<script lang="ts" setup>
import type { PickerMode } from 'ant-design-vue/es/vc-picker/interface';

import { computed } from 'vue';

import { RangePicker } from 'ant-design-vue';

interface Props {
  modelValue: any[];
  presets: any[];
  picker?: PickerMode;
  pickerLimit?: number;
  pickerLimitName?: null | string;
  allowClear?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  picker: 'date',
  pickerLimit: 0,
  pickerLimitName: null,
  allowClear: true,
});

const emit = defineEmits(['update:modelValue']);

const onChange = (val: any) => {
  emit('update:modelValue', val);
};

const getLimitName = computed(() => {
  if (props.pickerLimitName) {
    return props.pickerLimitName;
  }

  return `${props.pickerLimit} ${props.picker}s`;
});
</script>

<template>
  <div>
    <RangePicker
      :picker="props.picker"
      :value="props.modelValue as any"
      :presets="props.presets"
      :allow-clear="props.allowClear"
      @change="onChange"
    >
      <template
        #renderExtraFooter
        v-if="props.pickerLimit || props.pickerLimitName"
      >
        <div
          class="text-foreground flex w-full flex-col space-y-1 py-2 text-center italic"
        >
          <span class="leading-none">
            Please choose a date range within a maximum period of
            <strong>{{ getLimitName }}</strong> (GMT+0)
          </span>
          <span class="text-xs">
            Ex: From <strong>2022</strong>-01-01 to <strong>2022</strong>-01-15
            is a valid range
          </span>
        </div>
      </template>
    </RangePicker>
  </div>
</template>
