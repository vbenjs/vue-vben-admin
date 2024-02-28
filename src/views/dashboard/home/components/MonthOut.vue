<template>
  <Card size="small" title="每月出库统计">
    <div ref="chartRef" :style="{ height, width }"></div>
  </Card>
</template>
<script lang="ts" setup>
  import { ref, Ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { basicProps } from './props';
  import { addDay } from '@/utils/dateUtil';
  import { Card } from 'ant-design-vue';

  const days = 30;
  const props = defineProps({
    ...basicProps,
    data: {
      type: Array as PropType<{ title: string; qty: number }[]>,
      default: () => [],
    },
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  const setChartOptions = async () => {
    const date = addDay(1 - days);
    // const sortTime = [date, today].map((item) => formatToDate(item)).join(' - ');

    const xAxisData: string[] = [];
    const values: number[] = [];
    [...new Array(days)].forEach((_, index) => {
      const curDay = addDay(index, date);
      const day = curDay.date();
      const month = curDay.month() + 1;
      xAxisData.push(`${month}月${day}日`);

      const target = props.data.find((item) => {
        return curDay.format('MM/DD') === item.title;
      });
      values.push(Number(target?.qty ?? 0));
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

  watch(
    () => props.data,
    () => {
      setChartOptions();
    },
    { immediate: true },
  );
</script>
