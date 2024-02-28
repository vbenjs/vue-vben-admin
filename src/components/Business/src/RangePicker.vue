<template>
  <RangePicker
    v-bind="attrs"
    :value="date"
    :open="open"
    @change="(value) => handleChange(value as [string, string])"
    @open-change="handleOpenChange"
    :autofocus="false"
    :valueFormat="valueFormat"
    @calendar-change="calendarPriceRangeChange"
  />
</template>

<script lang="ts" setup>
  import { RangePicker, message } from 'ant-design-vue';
  import { ref, useAttrs, watch } from 'vue';
  import { formatToDate, getRangeDays } from '@/utils/dateUtil';

  const props = defineProps({
    value: {
      type: String,
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    valueFormat: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    offsetDays: {
      type: Number,
      default: 0,
    },
  });
  const emit = defineEmits(['update:value', 'change']);
  const attrs = useAttrs();

  const date = ref<[string, string] | undefined>(undefined);
  const open = ref(false);
  const afterChange = ref(false);

  const updateValue = (value?: string) => {
    emit('update:value', value);
    emit('change', value);
  };

  watch(
    () => props.value,
    (val) => {
      date.value = val?.split(' - ') as [string, string];
    },
    { immediate: true },
  );

  const handleChange = (dates?: [string, string]) => {
    const days = dates ? getRangeDays(dates) : 0;
    const { offsetDays } = props;
    if (offsetDays && days > offsetDays) {
      message.error(`最大可以选择的区间为${offsetDays}天`);
      dates = undefined;
    }
    const date = dates?.map((item) => formatToDate(item, props.format)) ?? [];
    updateValue(date?.join(' - '));
    afterChange.value = true;
    setTimeout(() => {
      afterChange.value = false;
    }, 300);
  };

  const handleOpenChange = (status: boolean) => {
    if (!status) {
      open.value = status;
    } else if (!afterChange.value) {
      open.value = status;
    }
  };

  function calendarPriceRangeChange() {
    // console.log(date);
    // date.selectPriceDate = date[0];
  }
</script>
