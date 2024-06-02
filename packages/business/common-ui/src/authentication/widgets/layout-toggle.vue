<script setup lang="ts">
import type { VbenDropdownMenuItem } from '@vben-core/shadcn-ui';

import { MdiDockBottom, MdiDockLeft, MdiDockRight } from '@vben-core/iconify';
import { preferences, usePreferences } from '@vben-core/preferences';
import { VbenDropdownRadioMenu, VbenIconButton } from '@vben-core/shadcn-ui';

import { $t } from '@vben/locales';
import { computed } from 'vue';

defineOptions({
  name: 'AuthenticationLayoutToggle',
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

const { authPanelCenter, authPanelLeft, authPanelRight } = usePreferences();
</script>

<template>
  <VbenDropdownRadioMenu
    v-model="preferences.app.authPageLayout"
    :menus="menus"
  >
    <VbenIconButton>
      <MdiDockRight v-if="authPanelRight" class="size-5" />
      <MdiDockLeft v-if="authPanelLeft" class="size-5" />
      <MdiDockBottom v-if="authPanelCenter" class="size-5" />
    </VbenIconButton>
  </VbenDropdownRadioMenu>
</template>
