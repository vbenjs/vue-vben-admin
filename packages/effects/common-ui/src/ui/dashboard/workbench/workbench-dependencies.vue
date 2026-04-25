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
    <CardContent class="flex flex-wrap p-5 pt-0">
      <ul class="w-full divide-y divide-border" role="list">
        <li
          v-for="dep in dependencies"
          :key="dep.name"
          class="flex justify-between gap-x-6 py-5"
        >
          <div class="flex min-w-0 items-center gap-x-4">
            <VbenIcon
              :icon="dep.icon"
              class="size-10 flex-none rounded-full bg-primary/10 p-2 text-primary"
            />
            <div class="min-w-0 flex-auto">
              <p class="text-sm/6 font-semibold text-foreground capitalize">
                {{ dep.name }}
              </p>
              <p class="mt-1 text-xs/5 text-foreground/80">
                核心框架依赖
              </p>
            </div>
          </div>
          <div class="hidden h-full shrink-0 sm:flex sm:flex-col sm:items-end">
            <span class="mt-6 text-sm/6 font-medium text-primary">
              {{ dep.version }}
            </span>
          </div>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>
