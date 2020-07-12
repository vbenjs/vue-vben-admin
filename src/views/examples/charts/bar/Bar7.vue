<script lang="tsx">
  import { defineComponent, onMounted, ref, Ref } from 'compatible-vue';

  import { useCharts } from '@/hooks/functions/useCharts';

  import { basicProps, BasicProps } from '../props';
  export default defineComponent({
    name: 'Bar7',
    props: basicProps,
    setup(props: BasicProps) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useCharts(chartRef as Ref<HTMLDivElement>);

      onMounted(() => {
        setOptions({
          title: {
            text: '简单例子',
            subtext: '资金分析',
            x: 'center',
            textStyle: {
              color: '#999',
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999',
              },
            },
          },
          backgroundColor: '#1C1E2B',
          textStyle: {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          color: ['#1E90FF', '#20B2AA', '#00FFFF', '#F0E68C', '#B77261'],
          toolbox: {
            feature: {
              dataView: {
                show: true,
                readOnly: false,
              },
              magicType: {
                show: true,
                type: ['line', 'bar', 'pie'],
              },
              restore: {
                show: true,
              },
              saveAsImage: {
                show: true,
              },
            },
          },
          xAxis: [
            {
              type: 'category',
              data: [
                '2020-01-01',
                '2020-02-11',
                '2020-03-31',
                '2020-04-30',
                '2020-05-10',
                '2020-05-20',
              ],
              axisPointer: {
                type: 'shadow',
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              name: '金额',
              min: -30000,
              max: 30000,
              axisLabel: {
                formatter: '{value} 元',
              },
            },
          ],

          series: [
            {
              name: '第三方贷款',
              type: 'bar',
              stack: 'one',
              data: ['-4891', '-6888', '-4568', '-1776', '-6420', '-9420'],
              barWidth: 'auto',
              itemStyle: {
                normal: {
                  barBorderRadius: 50,
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: 'rgba(255,37,117,0.7)',
                      },
                      {
                        offset: 0.5,
                        color: 'rgba(72,209,204,1)',
                      },
                      {
                        offset: 1,
                        color: 'rgba(72,209,204,0.8)',
                      },
                    ],
                    globalCoord: false,
                  },
                },
              },
            },
            {
              name: '信用卡',
              type: 'bar',
              stack: 'two',
              data: ['1780', '1965', '3829', '1445', '2953', '3001'],
              itemStyle: {
                normal: {
                  barBorderRadius: 50,
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: 'rgba(255,37,117,0.7)',
                      },
                      {
                        offset: 0.5,
                        color: 'rgba(30,144,255,1)',
                      },
                      {
                        offset: 1,
                        color: 'rgba(30,144,255,0.7)',
                      },
                    ],
                    globalCoord: false,
                  },
                },
              },
            },
            {
              name: '第三方存钱',
              type: 'bar',
              stack: 'three',
              data: ['5233', '586', '7037', '5782', '1912', '3897'],
              barWidth: 'auto',
              itemStyle: {
                normal: {
                  barBorderRadius: 50,
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: 'rgba(79,209,204,0.7)',
                      },
                      {
                        offset: 0.5,
                        color: 'rgba(79,209,204,1)',
                      },
                      {
                        offset: 1,
                        color: 'rgba(255,37,117,0.7)',
                      },
                    ],
                    globalCoord: false,
                  },
                },
              },
            },
            {
              name: '现金',
              type: 'bar',
              stack: 'four',
              data: ['137', '1030', '300', '304', '303', '303'],
              barWidth: 'auto',
              itemStyle: {
                normal: {
                  barBorderRadius: 50,
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: 'rgba(0,250,154,0.7)',
                      },
                      {
                        offset: 0.5,
                        color: 'rgba(0,250,154,1)',
                      },
                      {
                        offset: 1,
                        color: 'rgba(255,37,117,0.7)',
                      },
                    ],
                    globalCoord: false,
                  },
                },
              },
            },
            {
              name: '银行卡',
              type: 'bar',
              stack: 'five',
              data: ['170', '165', '3789', '3445', '2953', '3001'],
              barWidth: 'auto',
              itemStyle: {
                normal: {
                  barBorderRadius: 50,
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: 'rgba(127,255,170,0.7)',
                      },
                      {
                        offset: 0.5,
                        color: 'rgba(127,255,170,1)',
                      },
                      {
                        offset: 1,
                        color: 'rgba(255,37,117,0.7)',
                      },
                    ],
                    globalCoord: false,
                  },
                },
              },
            },
            {
              name: '资金占比',
              type: 'pie',
              radius: '25%',
              center: ['80%', '20%'],
              data: [
                {
                  name: '小金库',
                  value: 600.1,
                },
                {
                  name: '微信',
                  value: 3340.29,
                },
                {
                  name: '支付宝',
                  value: 5241.84,
                },
                {
                  name: '储蓄卡',
                  value: 20618.92,
                },
                {
                  name: '钱包',
                  value: 390.0,
                },
              ],
              roseType: 'area',
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
            {
              name: '欠款占比',
              type: 'pie',
              radius: '25%',
              center: ['20%', '20%'],
              data: [
                {
                  name: '白条',
                  value: -850.0,
                },
                {
                  name: '借钱',
                  value: -1000.0,
                },
                {
                  name: '信用卡',
                  value: -8063.33,
                },
                {
                  name: '蚂蚁花呗',
                  value: -466.0,
                },
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
            {
              name: '账单总额',
              type: 'line',
              data: [-10514, -15401, -1832, 3313, 4110, 9123],
              smooth: true,
              yaxisIndex: 1,
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
