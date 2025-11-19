<script setup lang="ts">
import { watch } from 'vue';

import { $t } from '@vben/locales';

import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@vben-core/shadcn-ui';

defineOptions({
  name: 'PreferenceFontSize',
});

const modelValue = defineModel<number>({
  default: 16,
});

const min = 15;
const max = 22;
const step = 1;

// 限制输入值在 min 和 max 之间
watch(
  modelValue,
  (newValue) => {
    if (newValue < min) {
      modelValue.value = min;
    } else if (newValue > max) {
      modelValue.value = max;
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <div class="flex items-center gap-2">
      <NumberField
        v-model="modelValue"
        :max="max"
        :min="min"
        :step="step"
        class="w-full"
      >
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
      <span class="text-muted-foreground whitespace-nowrap text-xs">px</span>
    </div>
    <div class="text-muted-foreground text-xs">
      {{ $t('preferences.theme.fontSizeTip') }}
    </div>
  </div>
</template>
