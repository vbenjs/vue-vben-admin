<script setup lang="ts">
import { ScrollArea } from '@vben-core/shadcn-ui';
import { useNamespace } from '@vben-core/toolkit';

import type { CSSProperties } from 'vue';

// import { onClickOutside } from '@vueuse/core';
import { computed, ref, shallowRef, useSlots, watchEffect } from 'vue';

import { SideCollapseButton, SidePinButton } from './widgets';

interface Props {
  /**
   * 背景颜色
   */
  backgroundColor: string;
  /**
   * 折叠区域高度
   * @default 32
   */
  collapseHeight?: number;
  /**
   * 折叠宽度
   * @default 48
   */
  collapseWidth?: number;
  /**
   * 隐藏的dom是否可见
   * @default true
   */
  domVisible?: boolean;
  /**
   * 扩展区域背景颜色
   */
  extraBackgroundColor: string;
  /**
   * 扩展区域宽度
   * @default 180
   */
  extraWidth?: number;
  /**
   * 固定扩展区域
   * @default false
   */
  fixedExtra?: boolean;
  /**
   * 头部高度
   */
  headerHeight: number;
  /**
   * 是否侧边混合模式
   * @default false
   */
  isSideMixed?: boolean;
  /**
   * 混合菜单宽度
   * @default 80
   */
  mixedWidth?: number;
  /**
   * 顶部padding
   * @default 60
   */
  paddingTop?: number;
  /**
   * 是否显示
   * @default true
   */
  show?: boolean;
  /**
   * 显示折叠按钮
   * @default false
   */
  showCollapseButton?: boolean;
  /**
   * 主题
   */
  theme?: string;

  /**
   * 宽度
   * @default 180
   */
  width?: number;
  /**
   * zIndex
   * @default 0
   */
  zIndex?: number;
}

defineOptions({ name: 'LayoutSide' });

const props = withDefaults(defineProps<Props>(), {
  collapseHeight: 42,
  collapseWidth: 48,
  domVisible: true,
  extraWidth: 180,
  fixedExtra: false,
  isSideMixed: false,
  mixedWidth: 80,
  paddingTop: 60,
  show: true,
  showCollapseButton: true,
  theme: 'dark',
  width: 180,
  zIndex: 0,
});

const emit = defineEmits<{ leave: [] }>();
const collapse = defineModel<boolean>('collapse');
const extraCollapse = defineModel<boolean>('extraCollapse');
const expandOnHovering = defineModel<boolean>('expandOnHovering');
const expandOnHover = defineModel<boolean>('expandOnHover');
const extraVisible = defineModel<boolean>('extraVisible');

const { b, e, is } = useNamespace('side');
const slots = useSlots();

const asideRef = shallowRef<HTMLDivElement | null>();
const scrolled = ref(false);

const hiddenSideStyle = computed((): CSSProperties => {
  return calcMenuWidthStyle(true);
});

const style = computed((): CSSProperties => {
  const { isSideMixed, paddingTop, zIndex } = props;

  return {
    ...calcMenuWidthStyle(false),
    paddingTop: `${paddingTop}px`,
    zIndex,
    ...(isSideMixed && extraVisible.value ? { transition: 'none' } : {}),
  };
});

const extraStyle = computed((): CSSProperties => {
  const { extraBackgroundColor, extraWidth, show, width, zIndex } = props;
  return {
    backgroundColor: extraBackgroundColor,
    left: `${width}px`,
    width: extraVisible.value && show ? `${extraWidth}px` : 0,
    zIndex,
  };
});

const extraTitleStyle = computed((): CSSProperties => {
  const { headerHeight } = props;

  return {
    height: `${headerHeight - 1}px`,
  };
});

const contentWidthStyle = computed((): CSSProperties => {
  const { collapseWidth, fixedExtra, isSideMixed, mixedWidth } = props;
  if (isSideMixed && fixedExtra) {
    return { width: `${collapse.value ? collapseWidth : mixedWidth}px` };
  }
  return {};
});

const contentStyle = computed((): CSSProperties => {
  const { collapseHeight, headerHeight } = props;

  return {
    height: `calc(100% - ${headerHeight + collapseHeight}px)`,
    paddingTop: '8px',
    ...contentWidthStyle.value,
  };
});

const headerStyle = computed((): CSSProperties => {
  const { headerHeight, isSideMixed } = props;

  return {
    ...(isSideMixed ? { display: 'flex', justifyContent: 'center' } : {}),
    height: `${headerHeight}px`,
    ...contentWidthStyle.value,
  };
});

const extraContentStyle = computed((): CSSProperties => {
  const { collapseHeight, headerHeight } = props;
  return {
    color: 'red',
    height: `calc(100% - ${headerHeight + collapseHeight}px)`,
  };
});

const collapseStyle = computed((): CSSProperties => {
  const { collapseHeight } = props;

  return {
    height: `${collapseHeight}px`,
  };
});

watchEffect(() => {
  extraVisible.value = props.fixedExtra ? true : extraVisible.value;
});

function calcMenuWidthStyle(isHiddenDom: boolean): CSSProperties {
  const { backgroundColor, extraWidth, fixedExtra, isSideMixed, show, width } =
    props;

  let widthValue = `${width + (isSideMixed && fixedExtra && extraVisible.value ? extraWidth : 0)}px`;

  const { collapseWidth } = props;

  if (isHiddenDom && expandOnHovering.value && !expandOnHover.value) {
    widthValue = `${collapseWidth}px`;
  }

  return {
    ...(widthValue === '0px' ? { overflow: 'hidden' } : {}),
    backgroundColor,
    flex: `0 0 ${widthValue}`,
    marginLeft: show ? 0 : `-${widthValue}`,
    maxWidth: widthValue,
    minWidth: widthValue,
    width: widthValue,
  };
}

function handleMouseenter() {
  // 未开启和未折叠状态不生效
  if (expandOnHover.value) {
    return;
  }
  if (!expandOnHovering.value) {
    collapse.value = false;
  }
  expandOnHovering.value = true;
}

function handleMouseleave() {
  emit('leave');

  if (expandOnHover.value) {
    return;
  }
  expandOnHovering.value = false;
  collapse.value = true;
  extraVisible.value = false;
}

function handleScroll(event: Event) {
  const target = event.target as HTMLElement;
  scrolled.value = (target?.scrollTop ?? 0) > 0;
}
</script>

<template>
  <div v-if="domVisible" :class="e('hide')" :style="hiddenSideStyle"></div>
  <aside
    :class="[b(), is(theme, true)]"
    :style="style"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <SidePinButton
      v-if="!collapse && !isSideMixed"
      v-model:expand-on-hover="expandOnHover"
      :theme="theme"
    />
    <div v-if="slots.logo" :style="headerStyle">
      <slot name="logo"></slot>
    </div>
    <ScrollArea :style="contentStyle" :on-scroll="handleScroll">
      <div :class="[e('shadow'), { scrolled }]"></div>
      <slot></slot>
    </ScrollArea>

    <div :style="collapseStyle"></div>
    <SideCollapseButton
      v-if="showCollapseButton && !isSideMixed"
      v-model:collapse="collapse"
      :theme="theme"
    />
    <div
      v-if="isSideMixed"
      ref="asideRef"
      :class="e('extra')"
      class="transition-[width] duration-200"
      :style="extraStyle"
    >
      <SideCollapseButton
        v-if="isSideMixed && expandOnHover"
        v-model:collapse="extraCollapse"
        :theme="theme"
      />

      <SidePinButton
        v-if="!extraCollapse"
        v-model:expand-on-hover="expandOnHover"
        :theme="theme"
      />
      <div v-if="!extraCollapse" :style="extraTitleStyle">
        <slot name="extra-title"></slot>
      </div>
      <ScrollArea
        :style="extraContentStyle"
        :class="e('extra-content')"
        :on-scroll="handleScroll"
      >
        <div :class="[e('shadow'), { scrolled }]"></div>
        <slot name="extra"></slot>
      </ScrollArea>
    </div>
  </aside>
</template>

<style scoped lang="scss">
@import '@vben-core/design/global';

@include b('side') {
  --color-surface: var(--color-menu);

  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  transition: all 0.2s ease 0s;

  @include is('dark') {
    --color-surface: var(--color-menu-dark);
  }

  @include e('shadow') {
    position: absolute;
    top: 0;
    z-index: 1;
    inline-size: 100%;
    block-size: 40px;
    height: 50px;
    pointer-events: none;
    background: linear-gradient(
      to bottom,
      hsl(var(--color-surface)),
      transparent
    );
    opacity: 0;
    transition: opacity 0.15s ease-in-out;
    will-change: opacity;

    &.scrolled {
      opacity: 1;
    }
  }

  @include is('dark') {
    .#{$namespace}-side__extra {
      &-content {
        border-color: hsl(var(--color-dark-border)) !important;
      }
    }
  }

  @include e('hide') {
    height: 100%;
    transition: all 0.2s ease 0s;
  }

  @include e('extra') {
    position: fixed;
    top: 0;
    height: 100%;
    overflow: hidden;
    transition: all 0.2s ease 0s;

    &-content {
      padding: 4px 0;
    }
  }
}
</style>
