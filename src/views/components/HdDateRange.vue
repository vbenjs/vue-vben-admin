<template>
  <div>
    <FormItemRest>
      <Row :gutter="10">
        <Col :span="16">
          <RangePicker
            :placeholder="['开始日期', '结束日期']"
            :disabledDate="disabledDate"
            v-model:value="rangeDate"
            :format="props.format"
            class="w-full"
          />
        </Col>
        <Col :span="8">
          <Select
            placeholder="快速选择时间"
            :options="dateRangeOptions"
            v-model:value="quickDate"
            allowClear
            class="w-full"
          />
        </Col>
      </Row>
    </FormItemRest>
  </div>
</template>

<script setup lang="ts">
  import { RangePicker, Row, Col, FormItemRest, Select } from 'ant-design-vue';
  import { getDictList } from '/@/api/sys/dictionary';
  import { ref, nextTick, watch, onMounted } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';

  type RangeDate = [Dayjs?, Dayjs?] | undefined;
  type OptionsItem = { label: string; value: string; disabled?: boolean };

  defineOptions({
    name: 'HdDateRange',
  });
  const emits = defineEmits(['change', 'update:value']);
  const props = defineProps({
    value: Array,
    format: {
      type: String,
      default: 'YYYY-MM-DD',
    },
  });

  const [state] = useRuleFormItem(props, 'value', 'change');

  const rangeDate = ref<RangeDate>();
  const dateRangeOptions = ref<OptionsItem[]>();
  const quickDate = ref<string | undefined>(undefined);

  onMounted(async () => {
    try {
      dateRangeOptions.value = await getDateRange();
    } catch (error) {
      console.log(error);
    }
  });
  // const date
  watch(
    () => rangeDate.value,
    (rangeDate) => {
      if (rangeDate) {
        emits('change', [
          rangeDate[0] ? rangeDate[0].format(props.format) : '',
          rangeDate[1] ? rangeDate[1].format(props.format) : '',
        ]);
      }
    },
  );

  watch(
    () => state.value,
    (v) => {
      if (!v) {
        resetFields();
      }
      emits('update:value', v);
    },
  );

  watch(
    () => quickDate.value,
    (v) => {
      if (!v) {
        rangeDate.value = [];
      } else {
        calcDate(v);
      }
    },
  );

  function disabledDate(current: Dayjs) {
    return current && current > dayjs().endOf('day');
  }

  // 计算时间值，如果结束时间有值，则从结束时间开始计算，如果为空，则将今日作为结束时间开始计算
  function calcDate(date) {
    const current = dayjs();
    const [year, month, day] = date.split('-');
    let startDate = rangeDate.value && rangeDate.value[0];
    let endDate: Dayjs = (rangeDate.value && rangeDate.value[1]) || current;
    startDate = endDate.subtract(year, 'year').subtract(month, 'month').subtract(day, 'day');
    rangeDate.value = [startDate, endDate];
  }
  async function getDateRange(): Promise<OptionsItem[]> {
    const list = await getDictList('KSXZSJ');
    let ret: OptionsItem[] = [];
    if (list && Array.isArray(list)) {
      ret = list.map((item) => {
        return {
          label: item.mc,
          value: item.bm,
        };
      });
    }
    return ret;
  }
  function resetFields() {
    nextTick(() => {
      rangeDate.value = undefined;
      quickDate.value = undefined;
    });
  }
</script>

<style lang="scss" scoped></style>
