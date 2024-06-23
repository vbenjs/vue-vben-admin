<script setup lang="ts">
import type { WorkbenchQuickNavItem } from '../typing';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VbenIcon,
} from '@vben-core/shadcn-ui';

interface Props {
  items: WorkbenchQuickNavItem[];
  title: string;
}

defineOptions({
  name: 'WorkbenchQuickNav',
});

withDefaults(defineProps<Props>(), {
  items: () => [],
});
</script>

<template>
  <Card>
    <CardHeader class="py-4">
      <CardTitle class="text-lg">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-wrap p-0">
      <template v-for="(item, index) in items" :key="item.title">
        <div
          :class="{
            'border-r-0': index % 3 === 2,
            'pb-4': index > 2,
            'border-b-0': index < 3,
          }"
          class="flex-col-center border-border w-1/3 border-b border-r border-t py-5 transition-all hover:shadow-xl"
        >
          <VbenIcon :color="item.color" :icon="item.icon" class="size-5" />
          <span class="text-md mt-2 truncate">{{ item.title }}</span>
        </div>
      </template>
    </CardContent>
  </Card>
</template>
