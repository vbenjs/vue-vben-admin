<template>
  <div>
    <Button preIcon="ant-design:left-outlined" @click="prev" />
    <DatePicker
      v-model:value="data.date"
      picker="month"
      valueFormat="YYYY-MM"
      format="YYYY-MM"
      :allowClear="false"
    />
    <Button preIcon="ant-design:right-outlined" @click="next" />
  </div>
</template>

<script lang="ts" setup name="WeekPicker">
  import { DatePicker } from 'ant-design-vue';
  import { reactive, watch } from 'vue';
  import { Time, dateUtil, addDay, formatToDate, getMonthRange } from '@/utils/dateUtil';
  import Button from '@/components/Button/src/BasicButton.vue';
  import { Dayjs } from 'dayjs';

  const props = defineProps({
    baseDate: {
      type: [String, Number, Object] as PropType<Time>,
      default: () => new Date(),
    },
    format: {
      type: String as PropType<string>,
      default: 'YYYY-MM',
    },
    modelValue: {
      type: String,
    },
    rangeValue: {
      type: String,
    },
    rangeFormat: {
      type: String as PropType<string>,
      default: 'YYYY-MM-DD',
    },
  });

  const emit = defineEmits(['update:modelValue', 'update:rangeValue', 'change']);

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
      const date = formatToDate(value, props.format);
      const range = getMonthRange(value, props.rangeFormat);
      emit('update:modelValue', date);
      emit('update:rangeValue', range);
      emit('change', date);
    },
    { immediate: true },
  );

  const prev = () => {
    data.date = addDay(-1, data.date, 'month');
  };
  const next = () => {
    data.date = addDay(1, data.date, 'month');
  };
</script>
<style lang="less" scoped>
  :deep(.ant-btn) {
    margin: 0 4px;
    padding: 4px 8px;
  }
</style>
