<script setup lang="ts">
import { computed } from 'vue';

import { $t } from '@vben/locales';
import { SelectOption } from '@vben/types';

import SelectItem from '../select-item.vue';
import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceTabsConfig',
});

defineProps<{ disabled?: boolean }>();

const tabbarEnable = defineModel<boolean>('tabbarEnable');
const tabbarShowIcon = defineModel<boolean>('tabbarShowIcon');
const tabbarPersist = defineModel<boolean>('tabbarPersist');
const tabbarDragable = defineModel<boolean>('tabbarDragable');
const tabbarStyleType = defineModel<string>('tabbarStyleType');
const tabbarShowMore = defineModel<boolean>('tabbarShowMore');
const tabbarShowRefresh = defineModel<boolean>('tabbarShowRefresh');
const tabbarShowMaximize = defineModel<boolean>('tabbarShowMaximize');

const styleItems = computed((): SelectOption[] => [
  {
    label: $t('preferences.tabbar.styleType.chrome'),
    value: 'chrome',
  },
  {
    label: $t('preferences.tabbar.styleType.plain'),
    value: 'plain',
  },
  {
    label: $t('preferences.tabbar.styleType.card'),
    value: 'card',
  },

  {
    label: $t('preferences.tabbar.styleType.brisk'),
    value: 'brisk',
  },
]);
</script>

<template>
  <SwitchItem v-model="tabbarEnable" :disabled="disabled">
    {{ $t('preferences.tabbar.enable') }}
  </SwitchItem>
  <SwitchItem v-model="tabbarPersist" :disabled="!tabbarEnable">
    {{ $t('preferences.tabbar.persist') }}
  </SwitchItem>
  <SwitchItem v-model="tabbarDragable" :disabled="!tabbarEnable">
    {{ $t('preferences.tabbar.dragable') }}
  </SwitchItem>
  <SelectItem v-model="tabbarStyleType" :items="styleItems">
    {{ $t('preferences.tabbar.styleType.title') }}
  </SelectItem>
  <SwitchItem v-model="tabbarShowIcon" :disabled="!tabbarEnable">
    {{ $t('preferences.tabbar.icon') }}
  </SwitchItem>
  <SwitchItem v-model="tabbarShowMore" :disabled="!tabbarEnable">
    {{ $t('preferences.tabbar.showMore') }}
  </SwitchItem>
  <SwitchItem v-model="tabbarShowRefresh" :disabled="!tabbarEnable">
    {{ $t('preferences.tabbar.showRefresh') }}
  </SwitchItem>
  <SwitchItem v-model="tabbarShowMaximize" :disabled="!tabbarEnable">
    {{ $t('preferences.tabbar.showMaximize') }}
  </SwitchItem>
</template>
