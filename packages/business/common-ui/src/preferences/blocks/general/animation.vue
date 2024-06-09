<script setup lang="ts">
import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceAnimation',
});
const transitionProgress = defineModel<boolean>('transitionProgress', {
  // 默认值
  default: false,
});

const transitionName = defineModel<string>('transitionName');
const transitionEnable = defineModel<boolean>('transitionEnable');

const transitionPreset = ['fade', 'fade-slide', 'fade-up', 'fade-down'];

function handleClick(value: string) {
  transitionName.value = value;
}
</script>

<template>
  <SwitchItem v-model="transitionProgress">
    {{ $t('preference.page-progress') }}
  </SwitchItem>
  <SwitchItem v-model="transitionEnable">
    {{ $t('preference.page-transition') }}
  </SwitchItem>
  <div
    v-if="transitionEnable"
    class="mb-2 mt-3 flex justify-between gap-3 px-2"
  >
    <div
      v-for="item in transitionPreset"
      :key="item"
      class="outline-box p-2"
      :class="{
        'outline-box-active': transitionName === item,
      }"
      @click="handleClick(item)"
    >
      <div class="bg-accent h-10 w-12 rounded-md" :class="`${item}-slow`"></div>
    </div>
  </div>
</template>
