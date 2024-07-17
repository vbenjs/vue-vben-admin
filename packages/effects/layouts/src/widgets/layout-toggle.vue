<script setup lang="ts">
import type { VbenDropdownMenuItem } from '@vben-core/shadcn-ui';
import type { AuthPageLayoutType } from '@vben-core/typings';

import { computed } from 'vue';

import { InspectionPanel, PanelLeft, PanelRight } from '@vben-core/icons';
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
    icon: PanelLeft,
    key: 'panel-left',
    text: $t('authentication.layout.alignLeft'),
  },
  {
    icon: InspectionPanel,
    key: 'panel-center',
    text: $t('authentication.layout.center'),
  },
  {
    icon: PanelRight,
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
      <PanelRight v-if="authPanelRight" class="size-4" />
      <PanelLeft v-if="authPanelLeft" class="size-4" />
      <InspectionPanel v-if="authPanelCenter" class="size-4" />
    </VbenIconButton>
  </VbenDropdownRadioMenu>
</template>
