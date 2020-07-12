<script lang="tsx">
  import { defineComponent, onMounted, ref, Ref } from 'compatible-vue';

  import { useCharts } from '@/hooks/functions/useCharts';

  import { basicProps, BasicProps } from '../props';
  export default defineComponent({
    name: 'Pie7',
    props: basicProps,
    setup(props: BasicProps) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useCharts(chartRef as Ref<HTMLDivElement>);

      onMounted(() => {
        setOptions({
          backgroundColor: '#000',
          color: '#fff',
          tooltip: { show: false },
          grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',
            top: '0%',
            containLabel: true,
            borderWidth: '0',
          },
          title: {
            text: '进给倍率',
            bottom: '20%',
            left: '40%',
            textStyle: {
              fontSize: '1vw',
              color: '#fff',
            },
          },
          series: [
            {
              name: '业务指标',
              type: 'gauge',
              radius: '80%',
              splitNumber: 10, // 分割段数，默认为5
              z: 8,
              min: 0,
              max: 200,

              axisLine: {
                // 坐标轴线
                lineStyle: {
                  // 属性lineStyle控制线条样式
                  color: [[1, '#fff']],
                  width: 0,
                },
              },
              axisTick: {
                // 坐标轴小标记
                splitNumber: 5, // 每份split细分多少段
                length: 15, // 属性length控制线长
                lineStyle: {
                  // 属性lineStyle控制线条样式
                  color: '#fff',
                  width: 3,
                },
              },
              axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                formatter: function (v) {
                  v = v.toFixed();
                  // console.log(v)
                  switch (v + '') {
                    case '0':
                      return '0';
                    case '20':
                      return '20';
                    case '40':
                      return '40';
                    case '60':
                      return '60';
                    case '80':
                      return '80';
                    case '100':
                      return '100';
                    case '120':
                      return '120';
                    case '140':
                      return '140';
                    case '160':
                      return '160';
                    case '180':
                      return '180';
                    case '200':
                      return '200';
                  }
                },
                textStyle: {
                  // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                  color: '#fff',
                  fontSize: '0.8vw',
                },
              },
              splitLine: {
                // 分隔线
                show: true, // 默认显示，属性show控制显示与否
                length: 20, // 属性length控制线长
                lineStyle: {
                  // 属性lineStyle（详见lineStyle）控制线条样式
                  color: 'auto',
                  width: 5,
                },
              },
              pointer: {
                show: true,
                width: 10,
                length: '80%',
                color: '#fff',
              },
              detail: {
                show: false,
              },
              title: {
                show: false,
              },
              data: [
                {
                  value: 65,
                },
              ],
            },
            {
              type: 'gauge',
              radius: '84%',
              startAngle: '225',
              endAngle: '-45',
              splitNumber: '120',
              pointer: {
                show: false,
              },
              detail: {
                show: false,
              },

              axisLine: {
                show: true,
                lineStyle: {
                  color: [[1, 'yellow']],
                  width: 2,
                  opacity: 1,
                },
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
              },
              axisLabel: {
                show: false,
              },
            },
            {
              type: 'gauge',
              radius: '82%',
              startAngle: '225',
              endAngle: '-45',
              pointer: {
                show: true,
              },

              data: [
                {
                  name: '数值',
                  value: (99 / 200) * 100,
                },
              ],
              title: {
                show: false,
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#fff',
                  width: 10,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  opacity: 1,
                },
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
                length: 25,
                lineStyle: {
                  color: 'green',
                  width: 10,
                  type: 'solid',
                },
              },
              axisLabel: {
                show: false,
                formatter: function (v) {
                  return v.toFixed(0);
                },
              },
              animationDuration: 4000,
            },
            {
              type: 'gauge',
              z: 2,
              radius: '80%',
              startAngle: '225',
              endAngle: '-45',
              axisLine: {
                // 坐标轴线
                lineStyle: {
                  color: [[1, '#fff']],
                  fontSize: 40,
                  width: 1,
                  opacity: 1,
                },
              },
              splitLine: {
                show: false,
              },
              axisLabel: {
                show: false,
                formatter: function (v) {
                  return v.toFixed(0);
                },
              },
              pointer: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              detail: {
                show: false,
              },
            },
            {
              type: 'pie',
              sttartAngle: 90,
              radius: '80%',
              hoverAnimation: false,
              legendHoverLink: false,
              lable: {
                normal: {
                  show: false,
                },
                emphasis: {
                  show: false,
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
              },

              center: ['50%', '50%'],
              z: -10,
              data: [
                {
                  value: 100,
                  itemStyle: {
                    normal: {
                      color: {
                        type: 'radial',
                        x: 0.5,
                        y: 0.5,
                        r: 0.5,
                        colorStops: [
                          { offset: 0, color: '#00C2EB' },
                          { offset: 0.8, color: '#037495' },
                          { offset: 1, color: '#094461' },
                        ],
                      },
                      opacity: 0.5,
                    },
                  },
                },
              ],
            },
            {
              type: 'pie',
              sttartAngle: 90,
              radius: '88%',
              hoverAnimation: false,
              legendHoverLink: false,
              lable: {
                normal: {
                  show: false,
                },
                emphasis: {
                  show: false,
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
              },
              center: ['50%', '50%'],
              z: -15,
              data: [
                {
                  value: 100,
                  itemStyle: {
                    color: '#333333',
                  },
                },
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
