<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, Ref } from 'vue';

  import { useECharts } from '/@/hooks/web/useECharts';

  import { basicProps } from './props';

  const m2R2Data = [
    { value: 335, name: '移动设备', itemStyle: { color: '#1b65b9' } },
    { value: 310, name: '网页端', itemStyle: { color: '#3ca0f6' } },
    { value: 234, name: '手表', itemStyle: { color: '#2dc0c0' } },
    { value: 234, name: '其他', itemStyle: { color: '#7dd9b9' } },
  ];
  export default defineComponent({
    props: basicProps,
    setup() {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

      onMounted(() => {
        setOptions({
          title: [
            {
              text: '总设备',
              subtext: '1,430',
              textStyle: {
                fontSize: 12,
                color: '#4B535E85',
              },
              subtextStyle: {
                fontSize: 24,
                color: 'black',
              },
              textAlign: 'center',
              // @ts-ignore
              x: '34.5%',
              y: '40%',
            },
          ],
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 0, 0, .6)',
          },
          legend: {
            icon: 'circle',
            itemHeight: 10,
            type: 'scroll',
            orient: 'vertical',
            left: '70%',
            align: 'left',
            top: 'middle',
            textStyle: {
              color: '#8C8C8C',
            },
            height: 250,
          },
          series: [
            {
              name: '成交额',
              type: 'pie',
              center: ['35%', '50%'],
              radius: ['45%', '65%'],
              label: {
                show: false,
              },
              data: m2R2Data,
              animationDuration: 3000,
            },
          ],
        });
      });
      return { chartRef };
    },
  });
</script>
