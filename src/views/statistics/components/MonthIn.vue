<template>
  <Card size="small" title="每月入库统计">
    <div ref="chartRef" :style="{ height, width }"></div>
  </Card>
</template>
<script lang="ts" setup>
  import { ref, Ref } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { basicProps } from './props';
  import { addDay, isSameDay } from '@/utils/dateUtil';
  import { onMountedOrActivated } from '@vben/hooks';
  import { Card } from 'ant-design-vue';

  const days = 30;
  defineProps({
    ...basicProps,
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  onMountedOrActivated(() => {
    setChartOptions();
  });

  const setChartOptions = async () => {
    const date = addDay(1 - days);
    // const sortTime = [date, today].map((item) => formatToDate(item)).join(' - ');
    const data = new Array(days).fill(0).map((_, index) => {
      return {
        name: addDay(index, date),
        value: Math.floor(Math.random() * 1000),
      };
    });

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
