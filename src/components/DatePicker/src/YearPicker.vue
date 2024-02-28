<template>
  <div>
    <Button preIcon="ant-design:left-outlined" @click="prev" />
    <DatePicker
      v-model:value="data.date"
      picker="year"
      valueFormat="YYYY"
      format="YYYY"
      :allowClear="false"
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

  const props = defineProps({
    baseDate: {
      type: [String, Number, Object] as PropType<Time>,
      default: () => new Date(),
    },
    format: {
      type: String as PropType<string>,
      default: 'YYYY',
    },
    modelValue: {
      type: String,
    },
    isRange: {
      type: Boolean,
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
    data.date = addDay(-1, data.date, 'year');
  };
  const next = () => {
    data.date = addDay(1, data.date, 'year');
  };
</script>
<style lang="less" scoped>
  :deep(.ant-btn) {
    margin: 0 4px;
    padding: 4px 8px;
  }
</style>
