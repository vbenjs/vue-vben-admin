<script setup lang="ts">
import type { VbenDropdownMenuItem } from '@vben-core/shadcn-ui';
import type { AuthPageLayout } from '@vben-core/typings';

import { MdiDockBottom, MdiDockLeft, MdiDockRight } from '@vben-core/iconify';
import { VbenDropdownRadioMenu, VbenIconButton } from '@vben-core/shadcn-ui';

import { $t } from '@vben/locales';
import { preference, updatePreference, usePreference } from '@vben/preference';
import { computed } from 'vue';

defineOptions({
  name: 'AuthenticationLayoutToggle',
  // inheritAttrs: false,
});

const menus = computed((): VbenDropdownMenuItem[] => [
  {
    icon: MdiDockLeft,
    key: 'panel-left',
    text: $t('layout.align-left'),
  },
  {
    icon: MdiDockBottom,
    key: 'panel-center',
    text: $t('layout.center'),
  },
  {
    icon: MdiDockRight,
    key: 'panel-right',
    text: $t('layout.align-right'),
  },
]);

function handleUpdate(value: string) {
  updatePreference({
    authPageLayout: value as AuthPageLayout,
  });
}

const { authPanelCenter, authPanelLeft, authPanelRight } = usePreference();
</script>

<template>
  <VbenDropdownRadioMenu
    :menus="menus"
    :model-value="preference.authPageLayout"
    @update:model-value="handleUpdate"
  >
    <VbenIconButton>
      <MdiDockRight v-if="authPanelRight" class="size-5" />
      <MdiDockLeft v-if="authPanelLeft" class="size-5" />
      <MdiDockBottom v-if="authPanelCenter" class="size-5" />
    </VbenIconButton>
  </VbenDropdownRadioMenu>
</template>
