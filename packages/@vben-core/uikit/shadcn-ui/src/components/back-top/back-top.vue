<script lang="ts" setup>
import { IcRoundArrowUpward } from '@vben-core/iconify';

import { computed } from 'vue';

import { VbenButton } from '../button';
import { useBackTop } from './use-backtop';

import type { BacktopProps } from './backtop';

interface Props extends BacktopProps {}

defineOptions({ name: 'BackTop' });

const props = withDefaults(defineProps<Props>(), {
  bottom: 40,
  isGroup: false,
  right: 40,
  target: '',
  visibilityHeight: 200,
});

const backTopStyle = computed(() => ({
  bottom: `${props.bottom}px`,
  right: `${props.right}px`,
}));

const { handleClick, visible } = useBackTop(props);
</script>
<template>
  <transition name="fade-down">
    <VbenButton
      v-if="visible"
      :style="backTopStyle"
      class="bg-accent data fixed bottom-10 right-5 h-10 w-10 rounded-full"
      size="icon"
      variant="icon"
      @click="handleClick"
    >
      <IcRoundArrowUpward />
    </VbenButton>
  </transition>
</template>
