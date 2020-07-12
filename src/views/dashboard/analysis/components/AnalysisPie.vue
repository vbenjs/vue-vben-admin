<script lang="tsx">
  import { defineComponent, onMounted, ref, Ref } from 'compatible-vue';

  import { useCharts } from '@/hooks/functions/useCharts';

  import { basicProps, BasicProps } from './props';

  const m2R2Data = [
    { value: 335, name: '移动设备', itemStyle: { color: '#5B8FF9' } },
    { value: 310, name: '网页端', itemStyle: { color: '#55D187' } },
    { value: 234, name: '手表', itemStyle: { color: '#FFD164' } },
    { value: 234, name: '其他', itemStyle: { color: '#ED6F6F' } },
  ];
  export default defineComponent({
    name: 'AnalysisLine',
    props: basicProps,
    setup(props: BasicProps) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useCharts(chartRef as Ref<HTMLDivElement>);

      onMounted(() => {
        setOptions({
          title: [
            {
              text: '总设备',
              subtext: '1,430',
              textStyle: {
                fontSize: 12,
                color: '#4B535E85',
              },
              subtextStyle: {
                fontSize: 24,
                color: 'black',
              },
              textAlign: 'center',
              // @ts-ignore
              x: '34.5%',
              y: '40%',
            },
          ],
          tooltip: {
            trigger: 'item',
          },
          legend: {
            icon: 'circle',
            itemHeight: 6,
            type: 'scroll',
            orient: 'vertical',
            left: '70%',
            align: 'left',
            top: 'middle',
            textStyle: {
              color: '#8C8C8C',
            },
            height: 250,
          },
          series: [
            {
              name: '成交额',
              type: 'pie',
              center: ['35%', '50%'],
              radius: ['40%', '65%'],
              label: {
                show: false,
              },
              data: m2R2Data,
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
