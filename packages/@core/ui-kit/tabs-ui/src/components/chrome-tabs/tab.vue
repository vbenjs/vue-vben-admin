<script setup lang="ts">
import type { IContextMenuItem } from '@vben-core/shadcn-ui';
import type { TabItem } from '@vben-core/typings';

import { IcRoundClose, MdiPin } from '@vben-core/iconify';
import { VbenContextMenu, VbenIcon } from '@vben-core/shadcn-ui';
import { useNamespace } from '@vben-core/toolkit';

import TabBackground from './tab-background.vue';

interface Props {
  affixTab?: boolean;
  icon?: string;
  menus: (data: any) => IContextMenuItem[];
  onlyOne?: boolean;
  showIcon?: boolean;
  tab: TabItem;
  title: string;
}

defineOptions({
  name: 'ChromeTab',
});

withDefaults(defineProps<Props>(), {
  icon: '',
});
const emit = defineEmits<{ close: []; unPushPin: [] }>();

const { b, e, is } = useNamespace('chrome-tab');

function handleClose() {
  emit('close');
}
function handleUnPushPin() {
  emit('unPushPin');
}
</script>

<template>
  <div
    :class="[b()]"
    class="absolute flex h-full cursor-pointer select-none items-center"
  >
    <VbenContextMenu
      :handler-data="tab"
      :menus="menus"
      :modal="false"
      item-class="pr-4"
    >
      <div class="h-full">
        <TabBackground />
        <div :class="e('content')" :title="title">
          <VbenIcon v-if="showIcon" :class="e('icon')" :icon="icon" fallback />
          <span :class="[e('label'), is('hidden-icon', !icon)]">
            {{ title }}
          </span>
        </div>
        <div
          v-show="!affixTab && !onlyOne"
          :class="e('extra')"
          @click.stop="handleClose"
        >
          <IcRoundClose :class="e('extra-icon')" />
        </div>
        <div
          v-show="affixTab && !onlyOne"
          :class="[e('extra'), is('pin', true)]"
          @click.stop="handleUnPushPin"
        >
          <MdiPin :class="e('extra-icon')" />
        </div>
      </div>
    </VbenContextMenu>
  </div>
</template>
