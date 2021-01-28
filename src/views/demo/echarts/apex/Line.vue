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
              name: 'Desktops',
              data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
            },
          ],
          chart: {
            height: 350,
            type: 'line',
            zoom: {
              enabled: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: 'straight',
          },
          title: {
            text: 'Product Trends by Month',
            align: 'left',
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5,
            },
          },
          xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          },
        });
      });
      return { chartRef };
    },
  });
</script>
