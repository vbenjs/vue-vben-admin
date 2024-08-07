<script lang="ts" setup>
import type { BacktopProps } from './backtop';

import { computed } from 'vue';

import { ArrowUpToLine } from '@vben-core/icons';

import { VbenButton } from '../button';
import { useBackTop } from './use-backtop';

interface Props extends BacktopProps {}

defineOptions({ name: 'BackTop' });

const props = withDefaults(defineProps<Props>(), {
  bottom: 24,
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
      class="bg-accent hover:bg-heavy data fixed bottom-10 right-5 z-[1000] h-10 w-10 rounded-full"
      size="icon"
      variant="icon"
      @click="handleClick"
    >
      <ArrowUpToLine class="size-4" />
    </VbenButton>
  </transition>
</template>
