<script lang="tsx">
  import { defineComponent, onMounted, ref, Ref } from 'compatible-vue';

  import { useCharts } from '@/hooks/functions/useCharts';

  import { basicProps, BasicProps } from '../props';
  export default defineComponent({
    name: 'Pie2',
    props: basicProps,
    setup(props: BasicProps) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useCharts(chartRef as Ref<HTMLDivElement>);

      onMounted(() => {
        setOptions({
          title: {
            text: 'Customized Pie',
            left: 'center',
            top: 20,
            textStyle: {
              color: '#ccc',
            },
          },

          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
          },

          visualMap: {
            // @ts-ignore
            show: false,
            min: 80,
            max: 600,
            inRange: {
              colorLightness: [0, 1],
            },
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: [
                { value: 335, name: '直接访问' },
                { value: 310, name: '邮件营销' },
                { value: 274, name: '联盟广告' },
                { value: 235, name: '视频广告' },
                { value: 400, name: '搜索引擎' },
              ].sort(function (a, b) {
                return a.value - b.value;
              }),
              roseType: 'radius',
              label: {
                color: 'rgba(255, 255, 255, 0.3)',
              },
              labelLine: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.3)',
                },
                smooth: 0.2,
                length: 10,
                length2: 20,
              },
              itemStyle: {
                color: '#c23531',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function () {
                return Math.random() * 200;
              },
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
