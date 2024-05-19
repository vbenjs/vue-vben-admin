<script setup lang="ts">
import type { SelectListItem } from '@vben-core/typings';

import { MdiQuestionMarkCircleOutline } from '@vben-core/iconify';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  VbenTooltip,
} from '@vben-core/shadcn-ui';

import { useSlots } from 'vue';

defineOptions({
  name: 'PreferenceSelectItem',
});

withDefaults(
  defineProps<{
    disabled: boolean;
    items?: SelectListItem[];
    placeholder?: string;
  }>(),
  {
    disabled: false,
    placeholder: '',
    items: () => [],
  },
);

const selectValue = defineModel<string>();

const slots = useSlots();
</script>

<template>
  <div
    class="my-1 flex w-full items-center justify-between rounded-md px-2 py-1"
    :class="{
      'hover:bg-accent': !slots.tip,
      'pointer-events-none opacity-50': disabled,
    }"
  >
    <span class="flex items-center text-sm">
      <slot></slot>

      <VbenTooltip v-if="slots.tip" side="bottom">
        <template #trigger>
          <MdiQuestionMarkCircleOutline class="ml-1 cursor-help" />
        </template>
        <slot name="tip"></slot>
      </VbenTooltip>
    </span>
    <Select v-model="selectValue">
      <SelectTrigger class="h-7 w-[140px]">
        <SelectValue :placeholder="placeholder" />
      </SelectTrigger>
      <SelectContent>
        <template v-for="item in items" :key="item.value">
          <SelectItem :value="item.value"> {{ item.label }} </SelectItem>
        </template>
      </SelectContent>
    </Select>
  </div>
</template>
