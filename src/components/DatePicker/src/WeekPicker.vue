<template>
  <div>
    <Button preIcon="ant-design:left-outlined" @click="prevWeek" />
    <DatePicker
      v-model:value="data.date"
      picker="week"
      valueFormat="YYYY-MM-DD"
      format="YYYY年第wo"
      :allowClear="false"
      @change="handleChange"
    />
    <Button preIcon="ant-design:right-outlined" @click="nextWeek" />
  </div>
</template>

<script lang="ts" setup name="WeekPicker">
  import { DatePicker } from 'ant-design-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import weekOfYear from 'dayjs/plugin/weekOfYear';
  import { reactive, watch } from 'vue';
  import { getWeekRange } from './functional';
  import { Time } from '@/utils/dateUtil';
  import Button from '@/components/Button/src/BasicButton.vue';

  dayjs.extend(weekOfYear);
  const props = defineProps({
    baseDate: {
      type: [String, Number, Object] as PropType<Time>,
      default: () => new Date(),
    },
    format: {
      type: String as PropType<string>,
      default: 'YYYY-MM-DD',
    },
    weekRange: {
      type: Array as any as PropType<[Time, Time] | []>,
    },
  });

  const emit = defineEmits(['update:weekRange', 'change']);

  const data = reactive({
    range: [] as [Time, Time] | [],
    date: dayjs() as string | Dayjs,
  });
  watch(
    () => props.baseDate,
    (value) => {
      data.date = dayjs(value).format(props.format);
      const range = getWeekRange(value, 0, props.format);
      data.range = range;
    },
    { immediate: true },
  );

  watch(
    () => data.range,
    (value) => {
      emit('update:weekRange', value);
      emit('change', value);
    },
    { immediate: true },
  );

  const prevWeek = () => {
    data.date = dayjs(data.date).subtract(7, 'day').format(props.format);
    const range = getWeekRange(data.date, 0, props.format);
    data.range = range;
  };
  const nextWeek = () => {
    data.date = dayjs(data.date).add(7, 'day').format(props.format);
    const range = getWeekRange(data.date, 0, props.format);
    data.range = range;
  };
  const handleChange = (date: Dayjs | string) => {
    const range = getWeekRange(date, 0, props.format);
    data.range = range;
  };
</script>
<style lang="less" scoped>
  :deep(.ant-btn) {
    margin: 0 4px;
    padding: 4px 8px;
  }
</style>
