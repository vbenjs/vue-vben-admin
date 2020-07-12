<script lang="tsx">
  import { defineComponent, onMounted, ref, Ref } from 'compatible-vue';

  import { useCharts } from '@/hooks/functions/useCharts';

  import { basicProps, BasicProps } from '../props';
  export default defineComponent({
    name: 'Line7',
    props: basicProps,
    setup(props: BasicProps) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useCharts(chartRef as Ref<HTMLDivElement>);
      const xData = (function () {
        const data: string[] = [];
        for (let i = 1; i < 15; i++) {
          data.push(i + '');
        }
        return data;
      })();
      onMounted(() => {
        setOptions({
          backgroundColor: '#344b58',
          title: {
            text: '16年1月-16年11月充值客单分析',
            subtext: 'BY MICVS',
            x: '4%',

            textStyle: {
              color: '#fff',
              fontSize: '22',
            },
            subtextStyle: {
              color: '#90979c',
              fontSize: '16',
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              textStyle: {
                color: '#fff',
              },
            },
          },
          grid: {
            borderWidth: 0,
            top: 110,
            bottom: 95,
            textStyle: {
              color: '#fff',
            },
          },
          legend: {
            x: '4%',
            top: '11%',
            textStyle: {
              color: '#90979c',
            },
            data: ['老用户', '新用户', '总'],
          },

          calculable: true,
          xAxis: [
            {
              type: 'category',
              axisLine: {
                lineStyle: {
                  color: '#90979c',
                },
              },
              splitLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              splitArea: {
                show: false,
              },
              axisLabel: {
                interval: 0,
              },
              data: xData,
            },
          ],
          yAxis: [
            {
              type: 'value',
              splitLine: {
                show: false,
              },
              axisLine: {
                lineStyle: {
                  color: '#90979c',
                },
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                interval: 0,
              },
              splitArea: {
                show: false,
              },
            },
          ],
          dataZoom: [
            {
              show: true,
              height: 30,
              xAxisIndex: [0],
              bottom: 30,
              start: 10,
              end: 80,
              handleIcon:
                'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
              handleSize: '110%',
              handleStyle: {
                color: '#d3dee5',
              },
              textStyle: {
                color: '#fff',
              },
              borderColor: '#90979c',
            },
            {
              type: 'inside',
              show: true,
              height: 15,
              start: 1,
              end: 35,
            },
          ],
          series: [
            {
              name: '老用户',
              type: 'bar',
              stack: '总量',
              barMaxWidth: 35,
              barGap: '10%',
              itemStyle: {
                normal: {
                  color: 'rgba(255,144,128,1)',
                  label: {
                    show: true,
                    textStyle: {
                      color: '#fff',
                    },
                    position: 'insideTop',
                    formatter: function (p) {
                      return p.value > 0 ? p.value : '';
                    },
                  },
                },
              },
              data: [
                198.66,
                330.81,
                151.95,
                160.12,
                222.56,
                229.05,
                128.53,
                250.91,
                224.47,
                473.99,
                126.85,
                260.5,
              ],
            },

            {
              name: '新用户',
              type: 'bar',
              stack: '总量',
              itemStyle: {
                normal: {
                  color: 'rgba(0,191,183,1)',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function (p) {
                      return p.value > 0 ? p.value : '';
                    },
                  },
                },
              },
              data: [
                82.89,
                67.54,
                62.07,
                59.43,
                67.02,
                67.09,
                35.66,
                71.78,
                81.61,
                78.85,
                79.12,
                72.3,
              ],
            },
            {
              name: '总',
              type: 'line',
              stack: '总量',
              symbolSize: 20,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: 'rgba(252,230,48,1)',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function (p) {
                      return p.value > 0 ? p.value : '';
                    },
                  },
                },
              },
              data: [
                281.55,
                398.35,
                214.02,
                219.55,
                289.57,
                296.14,
                164.18,
                322.69,
                306.08,
                552.84,
                205.97,
                332.79,
              ],
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
