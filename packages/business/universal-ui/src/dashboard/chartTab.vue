<script lang="ts" setup>
import { Tabs, TabsList, TabsTrigger } from '@vben-core/shadcn-ui';
import { chart } from '@vben/chart-ui';
defineOptions({ name: 'ChartTab' });
import type { ChartItem } from './typings';
import { onMounted, ref } from 'vue';
interface Props {
  items: ChartItem[];
}
const chartRef = ref();
onMounted(() => {
  change(0);
});
const change = (i) => {
  const item = props.items[i];
  if (!item) return;
  item.option && chartRef.value.setChart(item.option);
};
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
  <div class="rounded-lg border-2 border-solid">
    <Tabs
      :defaultValue="items[0].name"
      className="w-[400px]"
      @update:modelValue="change"
    >
      <TabsList className="flex w-full ">
        <TabsTrigger
          :value="index"
          v-for="(item, index) in items"
          :key="index"
          >{{ item.title }}</TabsTrigger
        >
      </TabsList>
    </Tabs>

    <chart ref="chartRef" />
  </div>
</template>
