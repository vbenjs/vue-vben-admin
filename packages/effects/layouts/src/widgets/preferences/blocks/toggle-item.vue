<script setup lang="ts">
import type { SelectOption } from '@vben/types';

import { ToggleGroup, ToggleGroupItem } from '@vben-core/shadcn-ui';

defineOptions({
  name: 'PreferenceToggleItem',
});

withDefaults(defineProps<{ disabled?: boolean; items?: SelectOption[] }>(), {
  disabled: false,
  items: () => [],
});

const modelValue = defineModel<string>();
</script>

<template>
  <div
    :class="{
      'pointer-events-none opacity-50': disabled,
    }"
    class="flex w-full items-center justify-between rounded-md p-2 hover:bg-accent"
    disabled
  >
    <span class="text-sm">
      <slot></slot>
    </span>
    <ToggleGroup
      v-model="modelValue"
      class="gap-2"
      size="sm"
      type="single"
      variant="outline"
    >
      <template v-for="item in items" :key="item.value">
        <ToggleGroupItem
          :value="item.value"
          class="h-7 rounded-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {{ item.label }}
        </ToggleGroupItem>
      </template>
    </ToggleGroup>
  </div>
</template>
