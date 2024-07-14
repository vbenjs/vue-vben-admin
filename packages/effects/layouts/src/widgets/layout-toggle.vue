<script setup lang="ts">
import type { VbenDropdownMenuItem } from '@vben-core/shadcn-ui';
import type { AuthPageLayoutType } from '@vben-core/typings';

import { computed } from 'vue';

import { MdiDockBottom, MdiDockLeft, MdiDockRight } from '@vben-core/icons';
import { $t } from '@vben-core/locales';
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
    text: $t('authentication.layout.alignLeft'),
  },
  {
    icon: MdiDockBottom,
    key: 'panel-center',
    text: $t('authentication.layout.center'),
  },
  {
    icon: MdiDockRight,
    key: 'panel-right',
    text: $t('authentication.layout.alignRight'),
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
