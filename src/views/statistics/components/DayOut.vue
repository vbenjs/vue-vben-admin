<template>
  <Card size="small" title="今日出库统计">
    <div ref="chartRef" :style="{ height, width }"></div>
  </Card>
</template>
<script lang="ts" setup>
  import { ref, Ref } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { basicProps } from './props';
  import { onMountedOrActivated } from '@vben/hooks';
  import { Card } from 'ant-design-vue';

  defineProps({
    ...basicProps,
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  onMountedOrActivated(() => {
    setChartOptions();
  });

  const setChartOptions = async () => {
    const data = new Array(24).fill(0).map((_, index) => {
      return {
        name: index + 1 + '',
        value: Math.floor(Math.random() * 1000),
      };
    });

    const xAxisData: string[] = [];
    const values: number[] = [];
    [...new Array(24)].forEach((_, index) => {
      const time = index + 1 + '';
      xAxisData.push(time);

      const target = data.find((item) => item.name == time);
      values.push(Number(target?.value ?? 0));
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
</script>
