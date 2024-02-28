<template>
  <div>
    <Button preIcon="ant-design:left-outlined" @click="prev" />
    <DatePicker
      v-model:value="data.date"
      picker="date"
      valueFormat="YYYY-MM-DD"
      format="YYYY-MM-DD"
      :allowClear="false"
      :locale="locale"
    />
    <Button preIcon="ant-design:right-outlined" @click="next" />
  </div>
</template>

<script lang="ts" setup name="WeekPicker">
  import { DatePicker } from 'ant-design-vue';
  import { reactive, watch } from 'vue';
  import { Time, dateUtil, addDay, formatToDate } from '@/utils/dateUtil';
  import Button from '@/components/Button/src/BasicButton.vue';
  import { Dayjs } from 'dayjs';
  import { PickerLocale } from 'ant-design-vue/es/date-picker/generatePicker/interface';

  const props = defineProps({
    baseDate: {
      type: [String, Number, Object] as PropType<Time>,
      default: () => new Date(),
    },
    format: {
      type: String as PropType<string>,
      default: 'YYYY-MM-DD',
    },
    modelValue: {
      type: String,
    },
    locale: {
      type: Object as PropType<PickerLocale>,
    },
  });

  const emit = defineEmits(['update:modelValue', 'change']);

  const data = reactive({
    date: undefined as Dayjs | undefined,
  });
  watch(
    () => props.baseDate,
    (value) => {
      data.date = dateUtil(value);
    },
    { immediate: true },
  );

  watch(
    () => data.date,
    (value) => {
      const day = formatToDate(value, props.format);
      emit('update:modelValue', day);
      emit('change', day);
    },
    { immediate: true },
  );

  const prev = () => {
    data.date = addDay(-1, data.date);
  };
  const next = () => {
    data.date = addDay(1, data.date);
  };
</script>
<style lang="less" scoped>
  :deep(.ant-btn) {
    margin: 0 4px;
    padding: 4px 8px;
  }
</style>
