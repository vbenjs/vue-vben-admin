<script setup lang="ts">
import { computed } from 'vue';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VbenCountToAnimator,
} from '@vben/common-ui';

interface Props {
  items?: any;
  loading?: boolean;
}

defineOptions({
  name: 'CustomerStatistic',
});

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  loading: false,
});

const getItems = computed(() => {
  return [
    {
      title: 'Orders',
      value: 1000,
    },
    {
      title: 'Revenue',
      value: 1000,
    },
    {
      title: 'Net Profit',
      value: 1000,
    },
    {
      title: 'Net Profit Margin',
      value: 1000,
    },
    {
      title: 'Custom Cost',
      value: 1000,
    },
  ];
});
const getItems22 = computed(() => {
  return [
    {
      title: 'Orders',
      value: 1000,
    },
    {
      title: 'Revenue',
      value: 1000,
    },
    {
      title: 'Net Profit',
      value: 1000,
    },
    {
      title: 'Net Profit Margin',
      value: 1000,
    },
    {
      title: 'Custom Cost',
      value: 1000,
    },
    {
      title: 'Orders',
      value: 1000,
    },
    {
      title: 'Revenue',
      value: 1000,
    },
    {
      title: 'Net Profit',
      value: 1000,
    },
    {
      title: 'Net Profit Margin',
      value: 1000,
    },
    {
      title: 'Custom Cost',
      value: 1000,
    },
    {
      title: 'Orders',
      value: 1000,
    },
    {
      title: 'Revenue',
      value: 1000,
    },
    {
      title: 'Net Profit',
      value: 1000,
    },
    {
      title: 'Net Profit Margin',
      value: 1000,
    },
    {
      title: 'Custom Cost',
      value: 1000,
    },
  ];
});
</script>

<template>
  <div
    v-loading="props.loading"
    class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
  >
    <template v-for="item in getItems" :key="item.title">
      <Card class="w-full" :title="item.title">
        <CardHeader class="pb-2">
          <CardTitle class="">{{ item.title }}</CardTitle>
        </CardHeader>

        <CardContent class="flex items-center justify-between">
          <VbenCountToAnimator :duration="0" :end-val="item.value" class="" />
        </CardContent>
      </Card>
    </template>
  </div>

  <Card
    class="mt-5 grid grid-cols-1 gap-4 pb-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    v-loading="props.loading"
  >
    <template v-for="item in getItems22" :key="item.title">
      <Card class="w-full border-0" :title="item.title">
        <CardHeader class="pb-2">
          <CardTitle class="">{{ item.title }}</CardTitle>
        </CardHeader>

        <CardContent class="pb-0">
          <VbenCountToAnimator :duration="0" :end-val="item.value" class="" />
        </CardContent>
      </Card>
    </template>
  </Card>
</template>
