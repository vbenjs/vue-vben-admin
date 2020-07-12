<script lang="tsx">
  import { defineComponent, onMounted, ref, Ref } from 'compatible-vue';

  import { useCharts } from '@/hooks/functions/useCharts';

  import { basicProps, BasicProps } from '../props';
  export default defineComponent({
    name: 'Line4',
    props: basicProps,
    setup(props: BasicProps) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useCharts(chartRef as Ref<HTMLDivElement>);

      onMounted(() => {
        setOptions({
          legend: {
            bottom: 10,
            left: 'center',
            data: ['香料香精', '粘度调节类', '防腐类', '防晒类', '防晒剂'],
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
          },

          xAxis: [
            {
              gridIndex: 0,
              show: false,
              type: 'category',
              boundaryGap: false,
              data: [
                '2017年2季度',
                '2017年3季度',
                '2017年4季度',
                '2018年1季度',
                '2018年2季度',
                '2018年3季度',
                '2018年4季度',
                '2019年1季度',
                '2019年2季度',
                '2019年3季度',
                '2019年4季度',
                '2020年1季度',
              ],
            },
            {
              gridIndex: 1,
              show: false,
              type: 'category',
              boundaryGap: false,
              data: [
                '2017年2季度',
                '2017年3季度',
                '2017年4季度',
                '2018年1季度',
                '2018年2季度',
                '2018年3季度',
                '2018年4季度',
                '2019年1季度',
                '2019年2季度',
                '2019年3季度',
                '2019年4季度',
                '2020年1季度',
              ],
            },
            {
              gridIndex: 2,
              show: false,
              type: 'category',
              boundaryGap: false,
              data: [
                '2017年2季度',
                '2017年3季度',
                '2017年4季度',
                '2018年1季度',
                '2018年2季度',
                '2018年3季度',
                '2018年4季度',
                '2019年1季度',
                '2019年2季度',
                '2019年3季度',
                '2019年4季度',
                '2020年1季度',
              ],
            },
            {
              gridIndex: 3,
              show: false,
              type: 'category',
              boundaryGap: false,
              data: [
                '2017年2季度',
                '2017年3季度',
                '2017年4季度',
                '2018年1季度',
                '2018年2季度',
                '2018年3季度',
                '2018年4季度',
                '2019年1季度',
                '2019年2季度',
                '2019年3季度',
                '2019年4季度',
                '2020年1季度',
              ],
            },
            {
              gridIndex: 4,
              type: 'category',
              boundaryGap: false,
              data: [
                '2017年2季度',
                '2017年3季度',
                '2017年4季度',
                '2018年1季度',
                '2018年2季度',
                '2018年3季度',
                '2018年4季度',
                '2019年1季度',
                '2019年2季度',
                '2019年3季度',
                '2019年4季度',
                '2020年1季度',
              ],
            },
          ],
          yAxis: [
            {
              gridIndex: 0,
              axisLabel: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
              },
              splitNumber: 1,
              name: '香料香精',
              nameLocation: 'center',
              nameRotate: 360,
            },
            {
              gridIndex: 1,
              axisLabel: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
              },
              splitNumber: 1,
              name: '粘度调节类',
              nameLocation: 'center',
              nameRotate: 360,
            },
            {
              gridIndex: 2,
              axisLabel: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
              },
              splitNumber: 1,
              name: '防腐类',
              nameLocation: 'center',
              nameRotate: 360,
            },
            {
              gridIndex: 3,
              axisLabel: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
              },
              splitNumber: 1,
              name: '防晒类',
              nameLocation: 'center',
              nameRotate: 360,
            },
            {
              gridIndex: 4,
              axisLabel: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
              },
              splitNumber: 1,
              name: '防晒剂',
              nameLocation: 'center',
              nameRotate: 360,
            },
          ],
          grid: [
            {
              top: '17%',
              height: '15%',
            },
            {
              top: '32%',
              height: '15%',
            },
            {
              top: '47%',
              height: '15%',
            },
            {
              top: '62%',
              height: '15%',
            },
            {
              bottom: '8%',
              height: '15%',
            },
          ],
          series: [
            {
              type: 'line',
              data: [0, 41.1, 30.4, 65.1, 53.3, 53.3, 53.3, 41.1, 30.4, 65.1, 53.3, 0],
              xAxisIndex: 0,
              yAxisIndex: 0,
              smooth: true,
              areaStyle: {},
            },
            {
              type: 'line',
              data: [0, 74.1, 67.2, 79.5, 46.4, 46.4, 46.4, 74.1, 67.2, 79.5, 46.4, 0],
              xAxisIndex: 1,
              yAxisIndex: 1,
              smooth: true,
              areaStyle: {},
            },
            {
              type: 'line',
              data: [0, 24.1, 7.2, 15.5, 42.4, 42.4, 42.4, 24.1, 7.2, 15.5, 42.4, 0],
              xAxisIndex: 2,
              yAxisIndex: 2,
              smooth: true,
              areaStyle: {},
            },
            {
              type: 'line',
              data: [0, 74.1, 67.2, 79.5, 46.4, 46.4, 46.4, 74.1, 67.2, 79.5, 46.4, 0],
              xAxisIndex: 3,
              yAxisIndex: 3,
              smooth: true,
              areaStyle: {},
            },
            {
              type: 'line',
              data: [0, 74.1, 67.2, 79.5, 46.4, 46.4, 46.4, 74.1, 67.2, 79.5, 46.4, 0],
              xAxisIndex: 4,
              yAxisIndex: 4,
              smooth: true,
              areaStyle: {},
            },
          ],
        });
      });
      return () => {
        const { width, height } = props;
        return <div ref={chartRef} style={{ height: height, width: width }} />;
      };
    },
  });
</script>
