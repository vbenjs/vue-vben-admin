<script setup lang="ts">
import type {
  LayoutHeaderMenuAlignType,
  LayoutHeaderModeType,
  SelectOption,
} from '@vben/types';

import { $t } from '@vben/locales';

import NumberFieldItem from '../number-field-item.vue';
import SelectItem from '../select-item.vue';
import SwitchItem from '../switch-item.vue';
import ToggleItem from '../toggle-item.vue';

defineProps<{ disabled: boolean }>();

const headerEnable = defineModel<boolean>('headerEnable');
const headerMode = defineModel<LayoutHeaderModeType>('headerMode');
const headerMenuAlign =
  defineModel<LayoutHeaderMenuAlignType>('headerMenuAlign');
const headerHeight = defineModel<number>('headerHeight');

const localeItems: SelectOption[] = [
  {
    label: $t('preferences.header.modeStatic'),
    value: 'static',
  },
  {
    label: $t('preferences.header.modeFixed'),
    value: 'fixed',
  },
  {
    label: $t('preferences.header.modeAuto'),
    value: 'auto',
  },
  {
    label: $t('preferences.header.modeAutoScroll'),
    value: 'auto-scroll',
  },
];

const headerMenuAlignItems: SelectOption[] = [
  {
    label: $t('preferences.header.menuAlignStart'),
    value: 'start',
  },
  {
    label: $t('preferences.header.menuAlignCenter'),
    value: 'center',
  },
  {
    label: $t('preferences.header.menuAlignEnd'),
    value: 'end',
  },
];
</script>

<template>
  <SwitchItem v-model="headerEnable" :disabled="disabled">
    {{ $t('preferences.header.visible') }}
  </SwitchItem>
  <SelectItem
    v-model="headerMode"
    :disabled="!headerEnable"
    :items="localeItems"
  >
    {{ $t('preferences.mode') }}
  </SelectItem>
  <ToggleItem
    v-model="headerMenuAlign"
    :disabled="!headerEnable"
    :items="headerMenuAlignItems"
  >
    {{ $t('preferences.header.menuAlign') }}
  </ToggleItem>
  <NumberFieldItem
    v-model="headerHeight"
    :disabled="!headerEnable || disabled"
    :max="100"
    :min="20"
    :step="1"
  >
    {{ $t('preferences.header.width') }}
  </NumberFieldItem>
</template>
