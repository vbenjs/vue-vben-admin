<script setup lang="ts">
import { IcRoundMenu } from '@vben-core/iconify';
import { VbenIconButton } from '@vben-core/shadcn-ui';
import { useNamespace } from '@vben-core/toolkit';

import type { CSSProperties } from 'vue';

import { computed, useSlots } from 'vue';

interface Props {
  /**
   * 背景颜色
   */
  backgroundColor?: string;

  /**
   * 横屏
   * @default false
   */
  fullWidth?: boolean;
  /**
   * 高度
   * @default 60
   */
  height?: number;
  /**
   * 是否混合导航
   * @default false
   */
  isMixedNav?: boolean;
  /**
   * 是否移动端
   * @default false
   */
  isMobile?: boolean;
  /**
   * 是否显示
   * @default true
   */
  show?: boolean;
  /**
   * 是否显示关闭菜单按钮
   * @default true
   */
  showToggleBtn?: boolean;
  /**
   * 侧边是否显示
   */
  sideHidden?: boolean;
  /**
   * 侧边菜单宽度
   * @default 0
   */
  sideWidth?: number;
  /**
   * 宽度
   * @default 100%
   */
  width?: string;
  /**
   * zIndex
   * @default 0
   */
  zIndex?: number;
}

defineOptions({ name: 'LayoutHeader' });

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: 'hsl(var(--color-background))',
  // fixed: true,
  height: 60,
  isMixedNav: false,
  show: true,
  showToggleBtn: false,
  sideWidth: 0,
  width: '100%',
  zIndex: 0,
});

const emit = defineEmits<{ openMenu: []; toggleMenu: [] }>();

const slots = useSlots();

const { b, e } = useNamespace('header');

const style = computed((): CSSProperties => {
  const { backgroundColor, fullWidth, height, show } = props;
  const right = !show || !fullWidth ? undefined : 0;

  return {
    // ...(props.isMixedNav ? { left: 0, position: `fixed` } : {}),
    backgroundColor,
    height: `${height}px`,
    marginTop: show ? 0 : `-${height}px`,
    right,
  };
});

const logoStyle = computed((): CSSProperties => {
  return {
    minWidth: `${props.isMobile ? 40 : props.sideWidth}px`,
  };
});

function handleToggleMenu() {
  emit('toggleMenu');
}

function handleOpenMenu() {
  emit('openMenu');
}
</script>

<template>
  <header :class="b()" :style="style">
    <div v-if="slots.logo" :style="logoStyle">
      <slot name="logo"></slot>
    </div>
    <VbenIconButton
      v-if="showToggleBtn"
      :class="e('toggle-btn')"
      @click="handleToggleMenu"
    >
      <IcRoundMenu class="size-5" />
    </VbenIconButton>

    <VbenIconButton
      v-if="isMobile"
      :class="e('toggle-btn')"
      @click="handleOpenMenu"
    >
      <IcRoundMenu class="size-5" />
    </VbenIconButton>

    <slot></slot>
  </header>
</template>

<style scoped lang="scss">
@import '@vben-core/design/global';

@include b('header') {
  top: 0;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid hsl(var(--color-border));

  @include e('toggle-btn') {
    margin: 0 4px 0 8px;
    border-radius: 4px;
  }
}
</style>
