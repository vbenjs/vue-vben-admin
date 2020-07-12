<script lang="tsx">
  import { defineComponent, onMounted, ref, Ref } from 'compatible-vue';

  import { useCharts } from '@/hooks/functions/useCharts';

  import { basicProps, BasicProps } from '../props';
  export default defineComponent({
    name: 'Bar6',
    props: basicProps,
    setup(props: BasicProps) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useCharts(chartRef as Ref<HTMLDivElement>);

      onMounted(() => {
        setOptions({
          angleAxis: {},
          radiusAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四'],
            z: 10,
          },
          polar: {},
          series: [
            {
              type: 'bar',
              data: [1, 2, 3, 4],
              coordinateSystem: 'polar',
              name: 'A',
              stack: 'a',
            },
            {
              type: 'bar',
              data: [2, 4, 6, 8],
              coordinateSystem: 'polar',
              name: 'B',
              stack: 'a',
            },
            {
              type: 'bar',
              data: [1, 2, 3, 4],
              coordinateSystem: 'polar',
              name: 'C',
              stack: 'a',
            },
          ],
          legend: {
            show: true,
            data: ['A', 'B', 'C'],
          },
        });
      });
      return () => {
        const { width, height } = props;
        return <div ref={chartRef} style={{ height: height, width: width }} />;
      };
    },
  });
</script>
