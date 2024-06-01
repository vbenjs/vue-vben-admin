<script setup lang="ts">
import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceAnimation',
});
const pageProgress = defineModel<boolean>('pageProgress', {
  // 默认值
  default: false,
});

const pageTransition = defineModel<string>('pageTransition');
const pageTransitionEnable = defineModel<boolean>('pageTransitionEnable');

const transitionPreset = ['fade', 'fade-slide', 'fade-up', 'fade-down'];

function handleClick(value: string) {
  pageTransition.value = value;
}
</script>

<template>
  <SwitchItem v-model="pageProgress">
    {{ $t('preference.page-progress') }}
  </SwitchItem>
  <SwitchItem v-model="pageTransitionEnable">
    {{ $t('preference.page-transition') }}
  </SwitchItem>
  <div
    v-if="pageTransitionEnable"
    class="mb-2 mt-3 flex justify-between gap-3 px-2"
  >
    <div
      v-for="item in transitionPreset"
      :key="item"
      class="outline-box p-2"
      :class="{
        'outline-box-active': pageTransition === item,
      }"
      @click="handleClick(item)"
    >
      <div class="bg-accent h-10 w-12 rounded-md" :class="`${item}-slow`"></div>
    </div>
  </div>
</template>
