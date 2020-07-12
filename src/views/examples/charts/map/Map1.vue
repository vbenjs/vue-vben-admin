<script lang="tsx">
  import { defineComponent, onMounted, ref, Ref } from 'compatible-vue';

  import { useCharts } from '@/hooks/functions/useCharts';

  import { basicProps, BasicProps } from '../props';
  import 'echarts/map/js/china';
  export default defineComponent({
    name: 'Map1',
    props: basicProps,
    setup(props: BasicProps) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useCharts(chartRef as Ref<HTMLDivElement>);

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
            padding: 0,
            enterable: true,
            transitionDuration: 1,
            textStyle: {
              color: '#000',
              decoration: 'none',
            },
          },
          series: [
            {
              name: 'iphone4',
              type: 'map',
              mapType: 'china',
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                },
                emphasis: {
                  label: {
                    show: true,
                  },
                },
              },
              data: [
                {
                  name: '北京',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '天津',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '上海',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '重庆',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '河北',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '河南',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '云南',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '辽宁',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '黑龙江',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '湖南',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '安徽',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '山东',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '新疆',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '江苏',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '浙江',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '江西',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '湖北',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '广西',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '甘肃',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '山西',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '内蒙古',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '陕西',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '吉林',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '福建',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '贵州',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '广东',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '青海',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '西藏',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '四川',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '宁夏',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '海南',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '台湾',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '香港',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
                },
                {
                  name: '澳门',
                  value: Math.round(Math.random() * 1000),
                  tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
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
