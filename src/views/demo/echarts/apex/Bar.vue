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
              data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
            },
          ],
          chart: {
            type: 'bar',
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          dataLabels: {
            enabled: false,
          },
          xaxis: {
            categories: [
              'South Korea',
              'Canada',
              'United Kingdom',
              'Netherlands',
              'Italy',
              'France',
              'Japan',
              'United States',
              'China',
              'Germany',
            ],
          },
        });
      });
      return { chartRef };
    },
  });
</script>
