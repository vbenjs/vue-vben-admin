<template>
  <Card size="small" title="告警属性统计">
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

    <div v-else ref="chartRef" :style="{ height, width }"></div>
  </Card>
</template>
<script lang="ts" setup>
  import { ref, Ref } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { basicProps } from './props';
  import { onMountedOrActivated } from '@vben/hooks';
  import { Card, Empty } from 'ant-design-vue';
  import { getHomeAttributeRemind } from '@/api/home';

  import emptyImg from '@/assets/icons/zzt.svg?inline';

  defineProps({
    ...basicProps,
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  const isEmpty = ref(false);

  onMountedOrActivated(() => {
    setChartOptions();
  });

  const setChartOptions = async () => {
    const data = await getHomeAttributeRemind();
    if (data.length === 0) {
      isEmpty.value = true;
      return;
    }

    const xAxisData: string[] = [];
    const values: number[] = [];
    data.forEach((item) => {
      xAxisData.push(item.name);

      values.push(Number(item.value ?? 0));
    });

    setOptions(
      {
        // title: {
        //   text: '业务服务类型统计',
        //   textStyle: {
        //     fontSize: 14,
        //   },
        // },
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: values,
            type: 'bar',
          },
        ],
      },
      true,
    );
  };
</script>
