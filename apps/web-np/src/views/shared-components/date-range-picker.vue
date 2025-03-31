<script lang="ts" setup>
import type { PickerMode } from 'ant-design-vue/es/vc-picker/interface';

import { RangePicker } from 'ant-design-vue';
import { Dayjs } from 'dayjs';

interface Props {
  modelValue: [Dayjs, Dayjs];
  presets: any[];
  picker: PickerMode;
  pickerLimit: number;
}
const props = withDefaults(defineProps<Props>(), {
  picker: 'date',
  pickerLimit: 0,
});

const emit = defineEmits(['update:modelValue']);

const onChange = (val: any) => {
  emit('update:modelValue', val);
};
</script>

<template>
  <div class="">
    <RangePicker
      :picker="props.picker"
      :value="props.modelValue"
      :presets="props.presets"
      @change="onChange"
    >
      <template #renderExtraFooter v-if="props.pickerLimit">
        <div class="text-foreground w-full text-center italic">
          Please select a range of {{ props.pickerLimit }} {{ props.picker }}s.
        </div>
      </template>
    </RangePicker>
  </div>
</template>
