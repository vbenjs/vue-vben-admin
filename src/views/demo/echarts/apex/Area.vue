<template>
  <div ref="chartRef" :style="{ width: '100%' }"></div>
</template>
<script lang="ts">
  import { defineComponent, ref, Ref, onMounted } from 'vue';

  import { useApexCharts } from '/@/hooks/web/useApexCharts';

  export default defineComponent({
    setup() {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useApexCharts(chartRef as Ref<HTMLDivElement>);

      onMounted(() => {
        setOptions({
          series: [
            {
              name: 'series1',
              data: [31, 40, 28, 51, 42, 109, 100],
            },
            {
              name: 'series2',
              data: [11, 32, 45, 32, 34, 52, 41],
            },
          ],
          chart: {
            height: 350,
            type: 'area',
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: 'smooth',
          },
          xaxis: {
            type: 'datetime',
            categories: [
              '2018-09-19T00:00:00.000Z',
              '2018-09-19T01:30:00.000Z',
              '2018-09-19T02:30:00.000Z',
              '2018-09-19T03:30:00.000Z',
              '2018-09-19T04:30:00.000Z',
              '2018-09-19T05:30:00.000Z',
              '2018-09-19T06:30:00.000Z',
            ],
          },
          tooltip: {
            x: {
              format: 'dd/MM/yy HH:mm',
            },
          },
        });
      });
      return { chartRef };
    },
  });
</script>
