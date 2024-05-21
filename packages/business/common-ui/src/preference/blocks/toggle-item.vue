<script setup lang="ts">
import type { SelectListItem } from '@vben/types';

import { ToggleGroup, ToggleGroupItem } from '@vben-core/shadcn-ui';

defineOptions({
  name: 'PreferenceToggleItem',
});

withDefaults(defineProps<{ disabled?: boolean; items: SelectListItem[] }>(), {
  disabled: false,
  items: () => [],
});

const modelValue = defineModel<string>();
</script>

<template>
  <div
    disabled
    class="hover:bg-accent flex w-full items-center justify-between rounded-md px-2 py-2"
    :class="{
      'pointer-events-none opacity-50': disabled,
    }"
  >
    <span class="text-sm"><slot></slot></span>
    <ToggleGroup
      v-model="modelValue"
      type="single"
      variant="outline"
      size="sm"
      class="gap-2"
    >
      <template v-for="item in items" :key="item.value">
        <ToggleGroupItem
          :value="item.value"
          class="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground h-7 rounded-sm"
        >
          {{ item.label }}
        </ToggleGroupItem>
      </template>
    </ToggleGroup>
  </div>
</template>
