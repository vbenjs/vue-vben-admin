<template>
  <div ref="chartRef" :style="{ width: '100%' }"></div>
</template>
<script lang="ts">
  import { defineComponent, Ref, ref, onMounted } from 'vue';

  import { useApexCharts } from '/@/hooks/web/useApexCharts';

  export default defineComponent({
    setup() {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useApexCharts(chartRef as Ref<HTMLDivElement>);
      onMounted(() => {
        setOptions({
          series: [
            { name: 'Visits', data: [90, 50, 86, 40, 100, 20] },
            { name: 'Sales', data: [70, 75, 70, 76, 20, 85] },
          ],
          chart: {
            height: 350,
            type: 'radar',
            toolbar: {
              show: false,
            },
          },
          yaxis: {
            show: false,
          },

          title: {
            show: false,
          },
          markers: {
            // size: 0,
          },
          xaxis: {
            categories: ['2016', '2017', '2018', '2019', '2020', '2021'],
          },
          stroke: {
            width: 0,
          },
          colors: ['#9f8ed7', '#1edec5'],

          fill: {
            type: 'gradient',
            gradient: {
              shade: 'dark',
              gradientToColors: ['#8e9ad6', '#1fcadb'],
              shadeIntensity: 1,
              type: 'horizontal',
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 100, 100, 100],
            },
          },
        });
      });
      return { chartRef };
    },
  });
</script>
