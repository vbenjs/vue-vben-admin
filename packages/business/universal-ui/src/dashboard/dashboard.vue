<script lang="ts" setup>
import type { CardItem, ChartItem } from './typings';

import { ref } from 'vue';

import Card from './card.vue';
import ChartCard from './chartCard.vue';
import ChartTab from './chartTab.vue';

interface Props {
  cardList: CardItem[];
  chartTabs: ChartItem[];
}

defineOptions({ name: 'Dashboard' });

withDefaults(defineProps<Props>(), {
  cardList: () => [],
  chartTabs: () => [],
});

const itemA = ref({
  option: {
    legend: {
      top: 'bottom',
    },
    series: [
      {
        center: ['50%', '50%'],
        data: [
          { name: 'rose 1', value: 40 },
          { name: 'rose 2', value: 38 },
          { name: 'rose 3', value: 32 },
          { name: 'rose 4', value: 30 },
          { name: 'rose 5', value: 28 },
          { name: 'rose 6', value: 26 },
          { name: 'rose 7', value: 22 },
          { name: 'rose 8', value: 18 },
        ],
        itemStyle: {
          borderRadius: 8,
        },
        name: 'Nightingale Chart',
        radius: [50, 200],
        roseType: 'area',
        type: 'pie',
      },
    ],
    toolbox: {
      feature: {
        dataView: { readOnly: false, show: true },
        mark: { show: true },
        restore: { show: true },
        saveAsImage: { show: true },
      },
      show: true,
    },
  },
  title: '玫瑰图',
});
const itemB = ref({
  option: {
    legend: {
      data: ['Allocated Budget', 'Actual Spending'],
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { max: 6500, name: 'Sales' },
        { max: 16_000, name: 'Administration' },
        { max: 30_000, name: 'Information Technology' },
        { max: 38_000, name: 'Customer Support' },
        { max: 52_000, name: 'Development' },
        { max: 25_000, name: 'Marketing' },
      ],
    },
    series: [
      {
        data: [
          {
            name: 'Allocated Budget',
            value: [4200, 3000, 20_000, 35_000, 50_000, 18_000],
          },
          {
            name: 'Actual Spending',
            value: [5000, 14_000, 28_000, 26_000, 42_000, 21_000],
          },
        ],
        name: 'Budget vs spending',
        type: 'radar',
      },
    ],
  },
  title: '雷达图',
});
const itemC = ref({
  option: {
    legend: {
      left: 'center',
      top: '5%',
    },
    series: [
      {
        avoidLabelOverlap: false,
        data: [
          { name: 'Search Engine', value: 1048 },
          { name: 'Direct', value: 735 },
          { name: 'Email', value: 580 },
          { name: 'Union Ads', value: 484 },
          { name: 'Video Ads', value: 300 },
        ],
        emphasis: {
          label: {
            fontSize: 40,
            fontWeight: 'bold',
            show: true,
          },
        },
        itemStyle: {
          borderColor: '#fff',
          borderRadius: 10,
          borderWidth: 2,
        },
        label: {
          position: 'center',
          show: false,
        },
        labelLine: {
          show: false,
        },
        name: 'Access From',
        radius: ['40%', '70%'],
        type: 'pie',
      },
    ],
    tooltip: {
      trigger: 'item',
    },
  },
  title: '饼图',
});
</script>

<template>
  <div>
    <div class="grid grid-cols-4 gap-4 p-2">
      <Card v-for="item in cardList" :key="item.title" :item="item" />
    </div>
    <div class="p-2"><ChartTab :items="chartTabs" /></div>
    <div class="grid grid-cols-3 gap-2 p-2">
      <ChartCard :item="itemA" />
      <ChartCard :item="itemB" />
      <ChartCard :item="itemC" />
    </div>
  </div>
</template>
