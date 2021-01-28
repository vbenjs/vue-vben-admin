<template>
  <CollapseContainer title="销售统计" :canExpan="false">
    <div ref="chartRef" :style="{ width: '100%' }"></div>
  </CollapseContainer>
</template>
<script lang="ts">
  import { defineComponent, Ref, ref, onMounted } from 'vue';

  import { CollapseContainer } from '/@/components/Container/index';
  import { useApexCharts } from '/@/hooks/web/useApexCharts';

  export default defineComponent({
    components: { CollapseContainer },
    setup() {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useApexCharts(chartRef as Ref<HTMLDivElement>);
      onMounted(() => {
        setOptions({
          series: [
            { name: 'Visits', data: [90, 50, 86, 40, 100, 20] },
            { name: 'Sales', data: [70, 75, 70, 76, 20, 85] },
          ],
          dataLabels: {
            style: {
              colors: ['#b9c3cd', '#b9c3cd', '#b9c3cd', '#b9c3cd', '#b9c3cd', '#b9c3cd'],
            },
          },
          chart: {
            height: 350,
            type: 'radar',
            dropShadow: {
              enabled: true,
              blur: 1,
              left: 1,
              top: 1,
            },
          },
          yaxis: {
            show: false,
          },
          grid: {
            show: false,
          },
          legend: { show: false },
          title: {
            show: false,
          },
          tooltip: {
            x: { show: false },
          },
          markers: {
            size: 0,
          },
          xaxis: {
            categories: ['2011', '2012', '2013', '2014', '2015', '2016'],
          },
          stroke: {
            width: 0,
          },
          colors: ['#9f8ed7', '#1edec5'],
          plotOptions: {
            radar: {
              polygons: {
                strokeColors: [
                  '#e8e8e8',
                  'transparent',
                  'transparent',
                  'transparent',
                  'transparent',
                  'transparent',
                ],
                connectorColors: 'transparent',
              },
            },
          },
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
