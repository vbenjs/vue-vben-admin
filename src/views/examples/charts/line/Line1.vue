<script lang="tsx">
  import { defineComponent, onMounted, ref, Ref } from 'compatible-vue';

  import { useCharts } from '@/hooks/functions/useCharts';

  import { basicProps, BasicProps } from '../props';
  export default defineComponent({
    name: 'Line1',
    props: basicProps,
    setup(props: BasicProps) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useCharts(chartRef as Ref<HTMLDivElement>);

      onMounted(() => {
        setOptions({
          // title: {
          //   text: '产品成交额',
          // },
          tooltip: {
            trigger: 'axis',
            padding: 3,
            backgroundColor: '#222',
            borderColor: '#777',
            borderWidth: 1,
          },
          legend: {
            icon: 'rect',
            itemWidth: 15,
            itemHeight: 4,
            left: 80,
            top: 0,
            orient: 'horizontal',
            data: ['产品一', '产品二'],
          },

          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },

          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [
              '一月',
              '二月',
              '三月',
              '四月',
              '五月',
              '六月',
              '七月',
              '八月',
              '九月',
              '十月',
              '十一月',
              '十二月',
            ],
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: '产品一',
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#5B8FF9',
                },
              },
              // areaStyle: {},
              data: [330, 132, 101, 134, 90, 230, 210, 150, 232, 234, 230, 400],
            },
            {
              name: '产品二',
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#55D187',
                },
              },
              data: [220, 182, 191, 234, 290, 330, 310, 330, 232, 201, 330, 190],
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
