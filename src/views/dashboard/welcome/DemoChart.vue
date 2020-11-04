<template>
  <div class="container">
    <div id="main"></div>
    <div id="main1" ref="elRef"></div>
  </div>
</template>

<script lang="ts">
  // https://vega.github.io/vega/usage/
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import echarts from 'echarts';

  export default defineComponent({
    name: 'DemoChart',
    setup() {
      const elRef = ref<any>(null);
      const { setOptions } = useECharts(elRef);

      // onMounted(() => {
      //   const el = unref(elRef);
      //   if (!el || !unref(el)) return;
      //   const chart = echarts.init(el);

      //   window.addEventListener('resize', () => {
      //     chart!.resize();
      //   });
      //   // removeResizeFn = removeEvent;
      //   var option = {
      //     title: {
      //       text: 'ECharts entry example',
      //     },
      //     tooltip: {},
      //     legend: {
      //       data: ['Sales'],
      //     },
      //     xAxis: {
      //       data: ['shirt', 'cardign', 'chiffon shirt', 'pants', 'heels', 'socks'],
      //     },
      //     yAxis: {},
      //     series: [
      //       {
      //         name: 'Sales',
      //         type: 'bar',
      //         data: [5, 20, 36, 10, 10, 20],
      //       },
      //     ],
      //   };
      //   chart && chart.setOption(option as any);
      // });
      onMounted(() => {
        var myChart = echarts.init(elRef.value);
        // specify chart configuration item and data
        var option = {
          title: {
            text: 'ECharts entry example',
          },
          tooltip: {},
          legend: {
            data: ['Sales'],
          },
          xAxis: {
            data: ['shirt', 'cardign', 'chiffon shirt', 'pants', 'heels', 'socks'],
          },
          yAxis: {},
          series: [
            {
              name: 'Sales',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20],
            },
          ],
        };
        setOptions(option);
        // use configuration item and data specified to show chart
        // myChart.setOption(option);
        // window.addEventListener('resize', () => {
        //   myChart.resize();
        // });
      });

      return { elRef };
    },
  });
</script>
<style>
  .container {
    width: 100%;
  }

  #main,
  #main1 {
    width: 40%;
    height: 300px;
  }
</style>
