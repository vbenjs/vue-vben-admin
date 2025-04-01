<script lang="ts" setup>
import type { PickerMode } from 'ant-design-vue/es/vc-picker/interface';

import { computed } from 'vue';

import { RangePicker } from 'ant-design-vue';
import { Dayjs } from 'dayjs';

interface Props {
  modelValue: [Dayjs, Dayjs];
  presets: any[];
  picker: PickerMode;
  pickerLimit?: number;
  pickerLimitName?: null | string;
}
const props = withDefaults(defineProps<Props>(), {
  picker: 'date',
  pickerLimit: 0,
  pickerLimitName: null,
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
  <div class="">
    <RangePicker
      :picker="props.picker"
      :value="props.modelValue"
      :presets="props.presets"
      @change="onChange"
    >
      <template
        #renderExtraFooter
        v-if="props.pickerLimit || props.pickerLimitName"
      >
        <div
          class="text-foreground flex w-full flex-col space-x-0 text-center italic"
        >
          <span>
            Please choose a date range within a maximum period of
            <strong>{{ getLimitName }}</strong>
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
