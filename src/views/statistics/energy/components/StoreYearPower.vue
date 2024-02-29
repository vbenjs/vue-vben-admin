<template>
  <div>
    <Card size="small" :title="year + '年度能耗统计'">
      <div ref="chartRef" :style="{ height, width }"></div>
    </Card>
  </div>
</template>
<script lang="ts" setup>
  import { ref, Ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { basicProps } from './props';
  import { Card } from 'ant-design-vue';
  import { getStoreYearPower } from '@/api/report';

  const props = defineProps({
    ...basicProps,
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  const setChartOptions = async (year?: string | number, storeId?: number) => {
    const data = year && storeId ? await getStoreYearPower(year, storeId) : [];

    const xAxisData: string[] = [];
    const values: number[] = [];
    [...new Array(12)].forEach((_, index) => {
      xAxisData.push(`${index + 1}月`);

      const target = data.find((item) => {
        return (
          Number(item.name.split('-')[1]) === index + 1 &&
          Number(item.name.split('-')[0]) === Number(props.year)
        );
      });
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
            name: `单位（kW·h）`,
            nameTextStyle: {
              color: '#aaa',
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

  // onMountedOrActivated(() => {
  //   setChartOptions();
  // });

  watch(
    [() => props.year, () => props.storeId],
    ([year, storeId]) => {
      setChartOptions(year, storeId);
    },
    { immediate: true },
  );
</script>
