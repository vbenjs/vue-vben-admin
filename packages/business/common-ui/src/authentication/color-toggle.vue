<script setup lang="ts">
import { IcRoundColorLens } from '@vben-core/iconify';
import { VbenIconButton } from '@vben-core/shadcn-ui';

import {
  preference,
  staticPreference,
  updatePreference,
} from '@vben/preference';

defineOptions({
  name: 'AuthenticationColorToggle',
});

function handleUpdate(value: string) {
  updatePreference({
    colorPrimary: value,
  });
}
</script>

<template>
  <div class="group relative flex items-center overflow-hidden">
    <div
      class="ease-ou flex w-0 overflow-hidden transition-all duration-500 group-hover:w-48"
    >
      <template
        v-for="color in staticPreference.colorPrimaryPresets"
        :key="color"
      >
        <VbenIconButton
          class="flex-center flex-shrink-0"
          @click="handleUpdate(color)"
        >
          <div
            class="relative h-3.5 w-3.5 rounded-[2px] before:absolute before:left-0.5 before:top-0.5 before:h-2.5 before:w-2.5 before:rounded-[2px] before:border before:border-gray-900 before:opacity-0 before:transition-all before:duration-150 before:content-[''] hover:scale-110"
            :class="[
              preference.colorPrimary === color ? `before:opacity-100` : '',
            ]"
            :style="{ backgroundColor: color }"
          ></div>
        </VbenIconButton>
      </template>
    </div>

    <VbenIconButton>
      <IcRoundColorLens class="text-primary size-5" />
    </VbenIconButton>
  </div>
</template>
