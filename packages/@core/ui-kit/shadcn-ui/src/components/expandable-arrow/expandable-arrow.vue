<script lang="ts" setup>
import { ChevronDown } from '@vben-core/icons';
import { cn } from '@vben-core/shared/utils';

const props = defineProps<{
  class?: string;
}>();

// 控制箭头展开/收起状态
const isExpanded = defineModel({ default: false });
</script>

<template>
  <div
    :class="
      cn(
        'text-primary hover:text-primary-hover inline-flex cursor-pointer items-center',
        props.class,
      )
    "
    @click="isExpanded = !isExpanded"
  >
    <slot :is-expanded="isExpanded">
      {{ isExpanded }}
      <!-- <span>{{ isExpanded ? '收起' : '展开' }}</span> -->
    </slot>
    <div
      :class="{ 'rotate-180': isExpanded }"
      class="transition-transform duration-300"
    >
      <slot name="icon">
        <ChevronDown class="size-4" />
      </slot>
    </div>
  </div>
</template>
