<template>
  <Card size="small" :title="'告警等级统计'">
    <Empty
      class="!mt-15"
      v-if="isEmpty"
      :image="emptyImg"
      :image-style="{
        display: 'flex',
        justifyContent: 'center',
      }"
      description="暂无告警"
    />

    <div v-show="!isEmpty" ref="chartRef" :style="{ height, width }"></div>
  </Card>
</template>
<script lang="ts" setup>
  import { ref, Ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { basicProps } from './props';
  import { Card, Empty } from 'ant-design-vue';

  import emptyImg from '@/assets/icons/bt.svg?inline';

  const props = defineProps({
    ...basicProps,
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  const isEmpty = ref(false);

  watch(
    () => props.data,
    () => {
      setChartOptions();
    },
  );

  const setChartOptions = async () => {
    const data = props.data;
    isEmpty.value = false;
    if (data.length === 0) {
      isEmpty.value = true;
      return;
    }

    const chartDataMap: { [index: string]: number } = {};
    data.forEach((item) => {
      chartDataMap[item.name] = Number(item.value);
    });

    const chartData = [
      { name: '提示', value: chartDataMap['提示'] },
      { name: '次要', value: chartDataMap['次要'] },
      { name: '重要', value: chartDataMap['重要'] },
      { name: '紧急', value: chartDataMap['紧急'] },
    ];

    setOptions(
      {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          top: 'bottom',
        },
        grid: {
          left: '3%',
          bottom: '3%',
          containLabel: true,
        },
        series: [
          {
            // color: ['#F43B34', '#F4911E', '#F4C424', '#1B78F4'],
            type: 'pie',
            center: ['50%', '45%'], //饼图的位置
            radius: '70%',
            data: chartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            label: {
              show: true,
              // formatter: '{b}: {c}({d}%)', //自定义显示格式(b:name, c:value, d:百分比)
              formatter: '{b}:{d}%',
            },
            // labelLine: {
            //   show: false,
            // },
          },
        ],
      },
      true,
    );
  };
</script>
