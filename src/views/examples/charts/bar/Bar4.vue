<script lang="tsx">
  import { defineComponent, onMounted, ref, Ref } from 'compatible-vue';

  import { useCharts } from '@/hooks/functions/useCharts';

  import { basicProps, BasicProps } from '../props';
  export default defineComponent({
    name: 'Bar4',
    props: basicProps,
    setup(props: BasicProps) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useCharts(chartRef as Ref<HTMLDivElement>);

      onMounted(() => {
        setOptions({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          legend: {
            data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'value',
          },
          yAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          },
          series: [
            {
              name: '直接访问',
              type: 'bar',
              stack: '总量',
              label: {
                show: true,
                position: 'insideRight',
              },
              data: [320, 302, 301, 334, 390, 330, 320],
            },
            {
              name: '邮件营销',
              type: 'bar',
              stack: '总量',
              label: {
                show: true,
                position: 'insideRight',
              },
              data: [120, 132, 101, 134, 90, 230, 210],
            },
            {
              name: '联盟广告',
              type: 'bar',
              stack: '总量',
              label: {
                show: true,
                position: 'insideRight',
              },
              data: [220, 182, 191, 234, 290, 330, 310],
            },
            {
              name: '视频广告',
              type: 'bar',
              stack: '总量',
              label: {
                show: true,
                position: 'insideRight',
              },
              data: [150, 212, 201, 154, 190, 330, 410],
            },
            {
              name: '搜索引擎',
              type: 'bar',
              stack: '总量',
              label: {
                show: true,
                position: 'insideRight',
              },
              data: [820, 832, 901, 934, 1290, 1330, 1320],
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
