<script lang="ts" setup>
import { chart } from '@vben/chart-ui';
defineOptions({ name: 'ChartCard' });
import type { ChartItem } from './typings';
import { onMounted, ref } from 'vue';
interface Props {
  item: ChartItem;
}
const chartRef = ref();
onMounted(() => {
  chartRef.value.setChart(props.item.option);
});

const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
  <div class="rounded-lg border-2 border-solid">
    <div class="">
      {{ item.title }}
    </div>
    <chart ref="chartRef" />
  </div>
</template>
