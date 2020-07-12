<script lang="tsx">
  import { defineComponent, onMounted, ref, Ref } from 'compatible-vue';

  import { useCharts } from '@/hooks/functions/useCharts';

  import { basicProps, BasicProps } from '../props';
  export default defineComponent({
    name: 'Pie8',
    props: basicProps,
    setup(props: BasicProps) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useCharts(chartRef as Ref<HTMLDivElement>);
      onMounted(() => {
        setOptions({
          title: {
            text: '嵌套饼图',
          },
          series: [
            {
              type: 'pie',
              data: [
                {
                  name: '国内',
                  value: 60,
                },
                {
                  name: '国外',
                  value: 40,
                },
              ],
              label: {
                position: 'inside',
              },
              radius: [0, 80],
              itemStyle: {
                borderWidth: 4,
                borderColor: '#FFFFFF',
              },
              clockwise: true,
              animation: false,
            },
            {
              type: 'pie',
              data: [
                {
                  name: '北京',
                  value: 20,
                },
                {
                  name: '天津',
                  value: 20,
                },
                {
                  name: '上海',
                  value: 20,
                },
                {
                  name: '美国',
                  value: 20,
                },
                {
                  name: '法国',
                  value: 20,
                },
              ],
              label: {
                position: 'inside',
              },
              radius: [80, 160],
              itemStyle: {
                borderWidth: 4,
                borderColor: '#FFFFFF',
              },
              animation: false,
            },
          ],
          backgroundColor: '#FFFFFF',
        });
      });
      return () => {
        const { width, height } = props;
        return <div ref={chartRef} style={{ height: height, width: width }} />;
      };
    },
  });
</script>
