<script setup lang="ts">
import type { DependencyInfo } from './dependencies';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VbenIcon,
} from '@vben-core/shadcn-ui';

import { getCoreDependencies } from './dependencies';

interface Props {
  title: string;
}

defineOptions({
  name: 'WorkbenchDependencies',
});

withDefaults(defineProps<Props>(), {});

const dependencies = getCoreDependencies();
</script>

<template>
  <Card>
    <CardHeader class="py-4">
      <CardTitle class="text-lg">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="p-5 pt-0">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="dep in dependencies"
          :key="dep.name"
          class="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-4 text-center transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:hover:shadow-lg"
        >
          <VbenIcon
            :icon="dep.icon"
            class="size-12 rounded-full bg-primary/10 p-2 text-primary dark:bg-accent dark:text-accent-foreground"
          />
          <p class="mt-3 text-sm/6 font-semibold text-foreground capitalize dark:text-gray-100">
            {{ dep.name }}
          </p>
          <p class="mt-1 text-xs/5 text-foreground/80 dark:text-gray-400">
            核心框架依赖
          </p>
          <span class="mt-2 text-sm/6 font-medium text-primary dark:text-accent-foreground">
            {{ dep.version }}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
