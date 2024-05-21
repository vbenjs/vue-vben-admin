<script lang="ts" setup>
import { VbenIcon } from '../icon';

import type { IBreadcrumb } from './interface';

interface Props {
  breadcrumbs: IBreadcrumb[];
  showIcon?: boolean;
}

defineOptions({ name: 'Breadcrumb' });
withDefaults(defineProps<Props>(), {
  showIcon: false,
});

const emit = defineEmits<{ select: [string] }>();

function handleClick(path?: string) {
  if (!path) {
    return;
  }
  emit('select', path);
}
</script>
<template>
  <ul class="flex">
    <TransitionGroup name="breadcrumb-transition">
      <template
        v-for="(item, index) in breadcrumbs"
        :key="`${item.path}-${item.title}-${index}`"
      >
        <li>
          <a href="javascript:void 0" @click.stop="handleClick(item.path)">
            <span class="flex-center h-full">
              <VbenIcon
                v-if="item.icon && showIcon"
                class="mr-1 size-5 flex-shrink-0"
                :icon="item.icon"
              />
              <span
                :class="{
                  'text-foreground font-normal':
                    index === breadcrumbs.length - 1,
                }"
                >{{ item.title }}
              </span>
            </span>
          </a>
        </li>
      </template>
    </TransitionGroup>
  </ul>
</template>
<style scoped>
li {
  @apply h-7;
}

li a {
  @apply text-muted-foreground bg-accent relative mr-9 flex h-7 items-center py-0 pl-[5px] pr-2 text-[13px];
}

li a > span {
  @apply -ml-3;
}

li:first-child a > span {
  @apply -ml-1;
}

li:first-child a {
  @apply rounded-[4px_0_0_4px] pl-[15px];
}

li:first-child a::before {
  @apply border-none;
}

li:last-child a {
  @apply rounded-[0_4px_4px_0] pr-[15px];
}

li:last-child a::after {
  @apply border-none;
}

li a::before,
li a::after {
  @apply border-accent absolute top-0 h-0 w-0 border-[14px] border-solid content-[''];
}

li a::before {
  @apply -left-7 z-[-1] border-l-transparent;
}

li a::after {
  @apply border-l-accent left-full border-transparent;
}

li:not(:last-child) a:hover {
  @apply bg-accent-hover;
}

li:not(:last-child) a:hover::before {
  @apply border-accent-hover border-l-transparent;
}

li:not(:last-child) a:hover::after {
  @apply border-l-accent-hover;
}
</style>
