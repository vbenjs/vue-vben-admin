<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, Ref } from 'vue';

  import { useECharts } from '/@/hooks/web/useECharts';

  import { basicProps } from './props';
  export default defineComponent({
    props: basicProps,
    setup() {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions, echarts } = useECharts(chartRef as Ref<HTMLDivElement>);

      onMounted(() => {
        setOptions({
          tooltip: {
            trigger: 'axis',
            padding: 3,
            borderColor: '#777',
            borderWidth: 1,
          },
          legend: {
            show: false,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisTick: {
              inside: true,
            },
            data: [
              '一月',
              '二月',
              '三月',
              '四月',
              '五月',
              '六月',
              '七月',
              '八月',
              '九月',
              '十月',
              '十一月',
              '十二月',
            ],
          },
          yAxis: {
            type: 'value',
            axisTick: {
              inside: true,
            },
          },
          series: [
            {
              name: '产品一',
              type: 'line',
              itemStyle: {
                color: '#5B8FF9',
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: '#5B8FF9',
                    },
                    {
                      offset: 1,
                      color: 'rgba(118,168,248, 0)',
                    },
                  ],
                  false
                ),
                shadowColor: 'rgba(118,168,248, 0.9)',
                shadowBlur: 20,
              },
              data: [134, 330, 132, 101, 90, 230, 210, 150, 230, 400, 232, 234],
              animationDuration: 3000,
            },
          ],
        });
      });
      return { chartRef };
    },
  });
</script>
