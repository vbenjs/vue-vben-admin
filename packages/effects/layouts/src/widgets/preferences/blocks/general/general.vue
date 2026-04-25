<script setup lang="ts">
import { watch } from 'vue';

import { SUPPORT_LANGUAGES } from '@vben/constants';
import { $t } from '@vben/locales';

import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@vben-core/shadcn-ui';

import InputItem from '../input-item.vue';
import SelectItem from '../select-item.vue';
import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceGeneralConfig',
});

const appLocale = defineModel<string>('appLocale');
const appDynamicTitle = defineModel<boolean>('appDynamicTitle');
const appWatermark = defineModel<boolean>('appWatermark');
const appWatermarkContent = defineModel<string>('appWatermarkContent');
const appWatermarkOpacity = defineModel<number>('appWatermarkOpacity');
const appEnableCheckUpdates = defineModel<boolean>('appEnableCheckUpdates');
const appEnableCopyPreferences = defineModel<boolean>(
  'appEnableCopyPreferences',
);

const min = 0.05;
const max = 0.5;
const step = 0.05;

watch(
  appWatermarkOpacity,
  (newValue) => {
    if (newValue < min) {
      appWatermarkOpacity.value = min;
    } else if (newValue > max) {
      appWatermarkOpacity.value = max;
    }
  },
  { immediate: true },
);
</script>

<template>
  <SelectItem v-model="appLocale" :items="SUPPORT_LANGUAGES">
    {{ $t('preferences.language') }}
  </SelectItem>
  <SwitchItem v-model="appDynamicTitle">
    {{ $t('preferences.dynamicTitle') }}
  </SwitchItem>
  <SwitchItem
    v-model="appWatermark"
    @update:model-value="
      (val) => {
        if (!val) appWatermarkContent = '';
      }
    "
  >
    {{ $t('preferences.watermark') }}
  </SwitchItem>
  <InputItem
    v-if="appWatermark"
    v-model="appWatermarkContent"
    :placeholder="$t('preferences.watermarkContent')"
  >
    {{ $t('preferences.watermarkContent') }}
  </InputItem>
  <div
    v-if="appWatermark"
    class="my-1 flex w-full items-center justify-between rounded-md px-2 py-1"
  >
    <span class="flex items-center text-sm">
      {{ $t('preferences.watermarkOpacity') }}
    </span>
    <div class="flex items-center gap-2">
      <NumberField
        v-model="appWatermarkOpacity"
        :max="max"
        :min="min"
        :step="step"
        class="w-41.25"
      >
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>
  </div>
  <SwitchItem v-model="appEnableCheckUpdates">
    {{ $t('preferences.checkUpdates') }}
  </SwitchItem>
  <SwitchItem v-model="appEnableCopyPreferences">
    {{ $t('preferences.enableCopyPreferences') }}
  </SwitchItem>
</template>
