<script lang="tsx">
  import { defineComponent, onMounted, ref, Ref } from 'compatible-vue';

  import { useCharts } from '@/hooks/functions/useCharts';

  import { basicProps, BasicProps } from '../props';
  export default defineComponent({
    name: 'Line6',
    props: basicProps,
    setup(props: BasicProps) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useCharts(chartRef as Ref<HTMLDivElement>);

      onMounted(() => {
        setOptions({
          title: {
            text: 'Step Line',
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['Step Start', 'Step Middle', 'Step End'],
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: 'Step Start',
              type: 'line',
              step: 'start',
              data: [120, 132, 101, 134, 90, 230, 210],
            },
            {
              name: 'Step Middle',
              type: 'line',
              step: 'middle',
              data: [220, 282, 201, 234, 290, 430, 410],
            },
            {
              name: 'Step End',
              type: 'line',
              step: 'end',
              data: [450, 432, 401, 454, 590, 530, 510],
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
