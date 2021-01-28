<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, Ref, onMounted } from 'vue';

  import { useECharts } from '/@/hooks/web/useECharts';
  import { mapData } from './data';

  import 'echarts/map/js/china';
  export default defineComponent({
    props: {
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: 'calc(100vh - 78px)',
      },
    },
    setup() {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

      onMounted(() => {
        setOptions({
          visualMap: {
            min: 0,
            max: 1000,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'],
            calculable: false,
            orient: 'horizontal',
            inRange: {
              color: ['#e0ffff', '#006edd'],
              symbolSize: [30, 100],
            },
          },
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 0, 0, .6)',
            textStyle: {
              color: '#fff',
              fontSize: 12,
            },
          },
          series: [
            {
              name: 'iphone4',
              type: 'map',
              mapType: 'china',
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    color: 'rgb(249, 249, 249)',
                    fontSize: 10,
                  },
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    color: 'rgb(249, 249, 249)',
                    fontSize: 14,
                  },
                },
              },
              itemStyle: {
                normal: {
                  label: { show: true },
                  areaColor: '#2f82ce',
                  borderColor: '#0DAAC1',
                },
                emphasis: {
                  label: { show: true },
                  areaColor: '#2f82ce',
                },
              },
              data: mapData,
            },
          ],
        });
      });
      return { chartRef };
    },
  });
</script>
