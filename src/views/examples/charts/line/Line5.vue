<script lang="tsx">
  import { defineComponent, onMounted, ref, Ref } from 'compatible-vue';

  import { useCharts } from '@/hooks/functions/useCharts';

  import { basicProps, BasicProps } from '../props';
  export default defineComponent({
    name: 'Line5',
    props: basicProps,
    setup(props: BasicProps) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useCharts(chartRef as Ref<HTMLDivElement>);

      onMounted(() => {
        setOptions({
          title: {
            text: '未来一周气温变化',
            subtext: '纯属虚构',
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['最高气温', '最低气温'],
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none',
              },
              dataView: { readOnly: false },
              magicType: { type: ['line', 'bar'] },
              restore: {},
              saveAsImage: {},
            },
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} °C',
            },
          },
          series: [
            {
              name: '最高气温',
              type: 'line',
              data: [11, 11, 15, 13, 12, 13, 10],
              markPoint: {
                data: [
                  { type: 'max', name: '最大值' },
                  { type: 'min', name: '最小值' },
                ],
              },
              markLine: {
                data: [{ type: 'average', name: '平均值' }],
              },
            },
            {
              name: '最低气温',
              type: 'line',
              data: [1, -2, 2, 5, 3, 2, 0],
              markPoint: {
                data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }],
              },
              markLine: {
                data: [
                  { type: 'average', name: '平均值' },
                  [
                    {
                      symbol: 'none',
                      x: '90%',
                      yAxis: 'max',
                    },
                    {
                      symbol: 'circle',
                      label: {
                        position: 'start',
                        formatter: '最大值',
                      },
                      type: 'max',
                      name: '最高点',
                    },
                  ],
                ],
              },
            },
          ],
        } as any);
      });
      return () => {
        const { width, height } = props;
        return <div ref={chartRef} style={{ height: height, width: width }} />;
      };
    },
  });
</script>
