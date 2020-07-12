<script lang="tsx">
  import { defineComponent, onMounted, ref, Ref } from 'compatible-vue';

  import { useCharts } from '@/hooks/functions/useCharts';

  import { basicProps, BasicProps } from '../props';
  export default defineComponent({
    name: 'Pie5',
    props: basicProps,
    setup(props: BasicProps) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useCharts(chartRef as Ref<HTMLDivElement>);

      onMounted(() => {
        setOptions({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
          },
          series: [
            {
              name: '库存情况',
              type: 'pie',
              radius: '68%',
              center: ['50%', '50%'],
              clockwise: false,
              data: [
                {
                  value: 45,
                  name: 'CARD',
                },
                {
                  value: 25,
                  name: 'SSD',
                },
                {
                  value: 15,
                  name: 'U盘',
                },
                {
                  value: 8,
                  name: '嵌入式',
                },
                {
                  value: 7,
                  name: 'FLASH',
                },
              ],
              label: {
                normal: {
                  textStyle: {
                    color: '#999',
                    fontSize: 14,
                  },
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
              },
              itemStyle: {
                normal: {
                  borderWidth: 4,
                  borderColor: '#ffffff',
                },
                emphasis: {
                  borderWidth: 0,
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
          color: ['#00acee', '#52cdd5', '#79d9f1', '#a7e7ff', '#c8efff'],
          backgroundColor: '#fff',
        });
      });
      return () => {
        const { width, height } = props;
        return <div ref={chartRef} style={{ height: height, width: width }} />;
      };
    },
  });
</script>
