<template>
  <Card size="small" title="今日入库统计">
    <div ref="chartRef" :style="{ height, width }"></div>
  </Card>
</template>
<script lang="ts" setup>
  import { ref, Ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { basicProps } from './props';
  import { Card } from 'ant-design-vue';

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
    const xAxisData: string[] = [];
    const values: number[] = [];
    [...new Array(24)].forEach((_, index) => {
      const time = index + '';
      xAxisData.push(time);

      const target = props.data.find((item) => Number(item.title) === Number(time));
      values.push(Number(target?.qty ?? 0));
    });

    setOptions(
      {
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
            data: values,
            itemStyle: {
              color: '#5ab1ef',
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
