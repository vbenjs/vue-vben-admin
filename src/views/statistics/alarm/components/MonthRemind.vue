<template>
  <Card size="small" title="告警数量统计">
    <div ref="chartRef" :style="{ height, width }"></div>
  </Card>
</template>
<script lang="ts" setup>
  import { ref, Ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { basicProps } from './props';
  import { addDay, getRangeDays, isSameDay } from '@/utils/dateUtil';
  import { Card } from 'ant-design-vue';
  import { NameValueResult } from '@/api/model/homeModel';

  const props = defineProps({
    ...basicProps,
    data: {
      type: Array as PropType<NameValueResult[]>,
      default: () => [],
    },
    dateRange: {
      type: String,
      required: true,
    },
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  watch(
    () => props.data,
    () => {
      setChartOptions();
    },
  );

  const setChartOptions = async () => {
    const range = props.dateRange.split(' - ');
    const date = range[0];
    const days = getRangeDays(range as [string, string]);
    const data = props.data;

    const xAxisData: string[] = [];
    const values: number[] = [];
    [...new Array(days)].forEach((_, index) => {
      const curDay = addDay(index, date);
      const day = curDay.date();
      const month = curDay.month() + 1;
      xAxisData.push(`${month}月${day}日`);

      const target = data.find((item) => {
        return isSameDay(item.name, curDay);
      });
      values.push(Number(target?.value ?? 0));
    });

    setOptions(
      {
        // title: {
        //   text: '每月警告统计',
        //   textStyle: {
        //     fontSize: 14,
        //   },
        // },

        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '10%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            // saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisData,
        },
        yAxis: [
          {
            type: 'value',
            splitNumber: 4,
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: '',
            type: 'line',
            // stack: 'Total',
            data: values,
            // smooth: true,
            itemStyle: {
              color: '#2FC25B',
            },
          },
        ],
      },
      true,
    );
  };
</script>
