<script setup lang="ts">
import type { AuthPageLayoutType } from '@vben-core/preferences';
import type { VbenDropdownMenuItem } from '@vben-core/shadcn-ui';

import { computed } from 'vue';

import { $t } from '@vben/locales';
import { MdiDockBottom, MdiDockLeft, MdiDockRight } from '@vben-core/iconify';
import {
  preferences,
  updatePreferences,
  usePreferences,
} from '@vben-core/preferences';
import { VbenDropdownRadioMenu, VbenIconButton } from '@vben-core/shadcn-ui';

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

function handleUpdate(value: string) {
  updatePreferences({
    app: {
      authPageLayout: value as AuthPageLayoutType,
    },
  });
}
</script>

<template>
  <VbenDropdownRadioMenu
    :menus="menus"
    :model-value="preferences.app.authPageLayout"
    @update:model-value="handleUpdate"
  >
    <VbenIconButton>
      <MdiDockRight v-if="authPanelRight" class="size-5" />
      <MdiDockLeft v-if="authPanelLeft" class="size-5" />
      <MdiDockBottom v-if="authPanelCenter" class="size-5" />
    </VbenIconButton>
  </VbenDropdownRadioMenu>
</template>
