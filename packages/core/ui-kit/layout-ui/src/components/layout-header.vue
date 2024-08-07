<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed, useSlots } from 'vue';

import { Menu } from '@vben-core/icons';
import { VbenIconButton } from '@vben-core/shadcn-ui';

interface Props {
  /**
   * 横屏
   */
  fullWidth: boolean;
  /**
   * 高度
   */
  height: number;
  /**
   * 是否混合导航
   * @default false
   */
  isMixedNav: boolean;
  /**
   * 是否移动端
   */
  isMobile: boolean;
  /**
   * 是否显示
   */
  show: boolean;
  /**
   * 是否显示关闭菜单按钮
   */
  showToggleBtn: boolean;

  /**
   * 侧边菜单宽度
   */
  sidebarWidth: number;
  /**
   * 宽度
   */
  width: string;
  /**
   * zIndex
   */
  zIndex: number;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{ openMenu: []; toggleSidebar: [] }>();

const slots = useSlots();

const style = computed((): CSSProperties => {
  const { fullWidth, height, show } = props;
  const right = !show || !fullWidth ? undefined : 0;

  return {
    height: `${height}px`,
    marginTop: show ? 0 : `-${height}px`,
    right,
  };
});

const logoStyle = computed((): CSSProperties => {
  return {
    minWidth: `${props.isMobile ? 40 : props.sidebarWidth}px`,
  };
});

function handleToggleMenu() {
  props.isMobile ? emit('openMenu') : emit('toggleSidebar');
}
</script>

<template>
  <header
    :style="style"
    class="border-border bg-background top-0 flex w-full flex-[0_0_auto] items-center border-b transition-[margin-top] duration-200"
  >
    <div v-if="slots.logo" :style="logoStyle">
      <slot name="logo"></slot>
    </div>
    <VbenIconButton
      v-if="showToggleBtn || isMobile"
      class="my-0 ml-2 mr-1 rounded"
      @click="handleToggleMenu"
    >
      <Menu class="size-4" />
    </VbenIconButton>
    <slot></slot>
  </header>
</template>
