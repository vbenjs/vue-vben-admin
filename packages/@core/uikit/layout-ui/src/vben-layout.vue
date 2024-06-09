<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed, ref, watch } from 'vue';

import { useMouse, useScroll, useThrottleFn } from '@vueuse/core';

import {
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSide,
  LayoutTabs,
} from './components';
import { VbenLayoutProps } from './vben-layout';

interface Props extends VbenLayoutProps {}

defineOptions({
  name: 'VbenLayout',
});

const props = withDefaults(defineProps<Props>(), {
  contentCompact: 'wide',
  contentPadding: 0,
  contentPaddingBottom: 0,
  contentPaddingLeft: 0,
  contentPaddingRight: 0,
  contentPaddingTop: 0,
  footerEnable: false,
  // footerBackgroundColor: '#fff',
  footerFixed: true,
  footerHeight: 32,
  // headerBackgroundColor: 'hsl(var(--color-background))',
  headerHeight: 50,
  headerHeightOffset: 10,
  headerHidden: false,

  headerMode: 'fixed',
  headerVisible: true,
  isMobile: false,
  layout: 'side-nav',
  sideCollapseShowTitle: false,
  // sideCollapse: false,
  sideCollapseWidth: 60,
  sideHidden: false,
  sideMixedWidth: 80,
  sideSemiDark: true,
  sideTheme: 'dark',
  sideWidth: 180,
  // tabsBackgroundColor: 'hsl(var(--color-background))',
  tabsHeight: 36,
  tabsVisible: true,
  zIndex: 200,
});

const emit = defineEmits<{ sideMouseLeave: [] }>();
const sideCollapse = defineModel<boolean>('sideCollapse');
const sideExtraVisible = defineModel<boolean>('sideExtraVisible');
const sideExtraCollapse = defineModel<boolean>('sideExtraCollapse');
const sideExpandOnHover = defineModel<boolean>('sideExpandOnHover');
const sideVisible = defineModel<boolean>('sideVisible', { default: true });

const {
  arrivedState,
  directions,
  isScrolling,
  y: scrollY,
} = useScroll(document);
const { y: mouseY } = useMouse({ type: 'client' });

// side是否处于hover状态展开菜单中
const sideExpandOnHovering = ref(false);
// const sideHidden = ref(false);
const headerIsHidden = ref(false);

const realLayout = computed(() => {
  return props.isMobile ? 'side-nav' : props.layout;
});

/**
 * 是否全屏显示content，不需要侧边、底部、顶部、tab区域
 */
const fullContent = computed(() => realLayout.value === 'full-content');

/**
 * 是否侧边混合模式
 */
const isSideMixedNav = computed(() => realLayout.value === 'side-mixed-nav');

/**
 * 是否为头部导航模式
 */
const isHeaderNav = computed(() => realLayout.value === 'header-nav');

/**
 * 是否为混合导航模式
 */
const isMixedNav = computed(() => realLayout.value === 'mixed-nav');

/**
 * 顶栏是否自动隐藏
 */
const isHeaderAuto = computed(() => props.headerMode === 'auto');

/**
 * header区域高度
 */
const getHeaderHeight = computed(() => {
  const { headerHeight, headerHeightOffset } = props;

  // if (!headerVisible) {
  //   return 0;
  // }

  // 顶部存在导航时，增加10
  const offset = isMixedNav.value || isHeaderNav.value ? headerHeightOffset : 0;

  return headerHeight + offset;
});

const headerWrapperHeight = computed(() => {
  let height = 0;
  if (props.headerVisible && !props.headerHidden) {
    height += getHeaderHeight.value;
  }
  if (props.tabsVisible) {
    height += props.tabsHeight;
  }

  return height;
});

const getSideCollapseWidth = computed(() => {
  const { sideCollapseShowTitle, sideCollapseWidth, sideMixedWidth } = props;
  return sideCollapseShowTitle || isSideMixedNav
    ? sideMixedWidth
    : sideCollapseWidth;
});

/**
 * 动态获取侧边区域是否可见
 */
const sideVisibleState = computed(() => {
  return !isHeaderNav.value && sideVisible.value;
});

/**
 * 侧边区域离顶部高度
 */
const sidePaddingTop = computed(() => {
  const { isMobile } = props;
  return isMixedNav.value && !isMobile ? getHeaderHeight.value : 0;
});

/**
 * 动态获取侧边宽度
 */
const getSideWidth = computed(() => {
  const { isMobile, sideHidden, sideMixedWidth, sideWidth } = props;
  let width = 0;

  if (sideHidden) {
    return width;
  }

  if (
    !sideVisibleState.value ||
    (sideHidden && !isSideMixedNav.value && !isMixedNav.value)
  ) {
    return width;
  }

  if (isSideMixedNav.value && !isMobile) {
    width = sideMixedWidth;
  } else if (sideCollapse.value) {
    width = isMobile ? 0 : getSideCollapseWidth.value;
  } else {
    width = sideWidth;
  }
  return width;
});

/**
 * 获取扩展区域宽度
 */
const getExtraWidth = computed(() => {
  const { sideWidth } = props;
  return sideExtraCollapse.value ? getSideCollapseWidth.value : sideWidth;
});

/**
 * 是否侧边栏模式，包含混合侧边
 */
const isSideMode = computed(() =>
  ['mixed-nav', 'side-mixed-nav', 'side-nav'].includes(realLayout.value),
);

const showSide = computed(() => {
  // if (isMixedNav.value && !props.sideHidden) {
  //   return false;
  // }
  return isSideMode.value && sideVisible.value;
});

const sideFace = computed(() => {
  const { sideSemiDark, sideTheme } = props;
  const isDark = sideTheme === 'dark' || sideSemiDark;

  let backgroundColor = '';
  let extraBackgroundColor = '';

  if (isDark) {
    backgroundColor = isSideMixedNav.value
      ? 'hsl(var(--color-menu-dark-darken))'
      : 'hsl(var(--color-menu-dark))';
  } else {
    backgroundColor = isSideMixedNav.value
      ? 'hsl(var(--color-menu-darken))'
      : 'hsl(var(--color-menu))';
  }

  extraBackgroundColor = isDark
    ? 'hsl(var(--color-menu-dark))'
    : 'hsl(var(--color-menu))';

  return {
    backgroundColor,
    extraBackgroundColor,
    theme: isDark ? 'dark' : 'light',
  };
});

/**
 * 遮罩可见性
 */
const maskVisible = computed(() => !sideCollapse.value && props.isMobile);

/**
 * header fixed值
 */
const headerFixed = computed(() => {
  return (
    isMixedNav.value ||
    ['auto', 'auto-scroll', 'fixed'].includes(props.headerMode)
  );
});

const mainStyle = computed(() => {
  let width = '100%';
  let sidebarWidth = 'unset';
  if (
    headerFixed.value &&
    !['header-nav', 'mixed-nav'].includes(realLayout.value) &&
    showSide.value &&
    !props.isMobile
  ) {
    // pin模式下生效
    const isSideNavEffective =
      isSideMixedNav.value && sideExpandOnHover.value && sideExtraVisible.value;

    if (isSideNavEffective) {
      const sideCollapseWidth = sideCollapse.value
        ? getSideCollapseWidth.value
        : props.sideMixedWidth;
      const sideWidth = sideExtraCollapse.value
        ? getSideCollapseWidth.value
        : props.sideWidth;

      // 100% - 侧边菜单混合宽度 - 菜单宽度
      sidebarWidth = `${sideCollapseWidth + sideWidth}px`;
      width = `calc(100% - ${sidebarWidth})`;
    } else {
      sidebarWidth =
        sideExpandOnHovering.value && !sideExpandOnHover.value
          ? `${getSideCollapseWidth.value}px`
          : `${getSideWidth.value}px`;
      width = `calc(100% - ${sidebarWidth})`;
    }
  }
  return {
    sidebarWidth,
    width,
  };
});

const tabsStyle = computed((): CSSProperties => {
  let width = '';
  let marginLeft = 0;

  if (!isMixedNav.value) {
    width = '100%';
  } else if (sideVisible.value) {
    marginLeft = sideCollapse.value
      ? getSideCollapseWidth.value
      : props.sideWidth;
    width = `calc(100% - ${getSideWidth.value}px)`;
  } else {
    width = '100%';
  }

  return {
    marginLeft: `${marginLeft}px`,
    width,
  };
});

const footerWidth = computed(() => {
  if (!props.footerFixed) {
    return '100%';
  }

  return mainStyle.value.width;
});

const contentStyle = computed((): CSSProperties => {
  const fixed = headerFixed.value;

  return {
    marginTop:
      fixed &&
      !fullContent.value &&
      !headerIsHidden.value &&
      (!isHeaderAuto.value || scrollY.value < headerWrapperHeight.value)
        ? `${headerWrapperHeight.value}px`
        : 0,
    paddingBottom: `${props.footerEnable ? props.footerHeight : 0}px`,
  };
});

const headerZIndex = computed(() => {
  const { zIndex } = props;
  const offset = isMixedNav.value ? 1 : 0;
  return zIndex + offset;
});

const headerWrapperStyle = computed((): CSSProperties => {
  const fixed = headerFixed.value;
  return {
    height: fullContent.value ? '0' : `${headerWrapperHeight.value}px`,
    left: isMixedNav.value ? 0 : mainStyle.value.sidebarWidth,
    position: fixed ? 'fixed' : 'static',
    top:
      headerIsHidden.value || fullContent.value
        ? `-${headerWrapperHeight.value}px`
        : 0,
    width: mainStyle.value.width,
    'z-index': headerZIndex.value,
  };
});

/**
 * 侧边栏z-index
 */
const sideZIndex = computed(() => {
  const { isMobile, zIndex } = props;
  const offset = isMobile || isSideMode.value ? 1 : -1;
  return zIndex + offset;
});

const maskStyle = computed((): CSSProperties => {
  return {
    zIndex: props.zIndex,
  };
});

const showHeaderToggleButton = computed(() => {
  return (
    isSideMode.value &&
    !isSideMixedNav.value &&
    !isMixedNav.value &&
    !props.isMobile
  );
  // return false;
});

const showHeaderLogo = computed(() => {
  return !isSideMode.value || isMixedNav.value || props.isMobile;
});

watch(
  () => props.isMobile,
  (val) => {
    sideCollapse.value = val;
  },
);

{
  const mouseMove = () => {
    mouseY.value > headerWrapperHeight.value
      ? (headerIsHidden.value = true)
      : (headerIsHidden.value = false);
  };
  watch(
    [() => props.headerMode, () => mouseY.value],
    () => {
      if (!isHeaderAuto.value || isMixedNav.value || fullContent.value) {
        return;
      }
      headerIsHidden.value = true;
      mouseMove();
    },
    {
      immediate: true,
    },
  );
}

{
  const checkHeaderIsHidden = useThrottleFn((top, bottom, topArrived) => {
    if (scrollY.value < headerWrapperHeight.value) {
      headerIsHidden.value = false;
      return;
    }
    if (topArrived) {
      headerIsHidden.value = false;
      return;
    }

    if (top) {
      headerIsHidden.value = false;
    } else if (bottom) {
      headerIsHidden.value = true;
    }
  }, 300);

  watch(
    () => scrollY.value,
    () => {
      if (
        props.headerMode !== 'auto-scroll' ||
        isMixedNav.value ||
        fullContent.value
      ) {
        return;
      }
      if (isScrolling.value) {
        checkHeaderIsHidden(
          directions.top,
          directions.bottom,
          arrivedState.top,
        );
      }
    },
  );
}

function handleClickMask() {
  sideCollapse.value = true;
}

function handleToggleMenu() {
  // sideVisible.value = !sideVisible.value;
  // sideHidden.value = !sideHidden.value;
}

function handleOpenMenu() {
  sideCollapse.value = false;
}
</script>

<template>
  <div class="relative flex min-h-full w-full">
    <slot name="preferences"></slot>
    <slot name="floating-button-group"></slot>
    <LayoutSide
      v-if="sideVisibleState"
      v-model:collapse="sideCollapse"
      v-model:expand-on-hover="sideExpandOnHover"
      v-model:expand-on-hovering="sideExpandOnHovering"
      v-model:extra-collapse="sideExtraCollapse"
      v-model:extra-visible="sideExtraVisible"
      :collapse-width="getSideCollapseWidth"
      :dom-visible="!isMobile"
      :extra-width="getExtraWidth"
      :fixed-extra="sideExpandOnHover"
      :header-height="isMixedNav ? 0 : getHeaderHeight"
      :is-side-mixed="isSideMixedNav"
      :mixed-width="sideMixedWidth"
      :padding-top="sidePaddingTop"
      :show="showSide"
      :width="getSideWidth"
      :z-index="sideZIndex"
      v-bind="sideFace"
      @leave="() => emit('sideMouseLeave')"
    >
      <template v-if="isSideMode && !isMixedNav" #logo>
        <slot name="logo"></slot>
      </template>

      <template v-if="isSideMixedNav">
        <slot name="mixed-menu"></slot>
      </template>
      <template v-else>
        <slot name="menu"></slot>
      </template>

      <template #extra>
        <slot name="side-extra"></slot>
      </template>
      <template #extra-title>
        <slot name="side-extra-title"></slot>
      </template>
    </LayoutSide>

    <div
      class="flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in"
    >
      <div
        :style="headerWrapperStyle"
        class="overflow-hidden transition-all duration-200"
      >
        <LayoutHeader
          v-if="headerVisible"
          :full-width="!isSideMode"
          :height="getHeaderHeight"
          :is-mixed-nav="isMixedNav"
          :is-mobile="isMobile"
          :show="!fullContent && !headerHidden"
          :show-toggle-btn="showHeaderToggleButton"
          :side-hidden="sideHidden"
          :side-width="sideWidth"
          :width="mainStyle.width"
          :z-index="headerZIndex"
          @open-menu="handleOpenMenu"
          @toggle-menu="handleToggleMenu"
        >
          <template v-if="showHeaderLogo" #logo>
            <slot name="logo"></slot>
          </template>
          <slot name="header"></slot>
        </LayoutHeader>

        <LayoutTabs v-if="tabsVisible" :height="tabsHeight" :style="tabsStyle">
          <slot name="tabs"></slot>
          <template #toolbar>
            <slot name="tabs-toolbar"></slot>
          </template>
        </LayoutTabs>
      </div>

      <!-- </div> -->
      <LayoutContent
        :content-compact="contentCompact"
        :content-compact-width="contentCompactWidth"
        :padding="contentPadding"
        :padding-bottom="contentPaddingBottom"
        :padding-left="contentPaddingLeft"
        :padding-right="contentPaddingRight"
        :padding-top="contentPaddingTop"
        :style="contentStyle"
        class="transition-[margin-top] duration-200"
      >
        <slot name="content"></slot>
      </LayoutContent>

      <LayoutFooter
        v-if="footerEnable"
        :fixed="footerFixed"
        :height="footerHeight"
        :show="!fullContent"
        :width="footerWidth"
        :z-index="zIndex"
      >
        <slot name="footer"></slot>
      </LayoutFooter>
    </div>
    <div
      v-if="maskVisible"
      :style="maskStyle"
      class="fixed left-0 top-0 h-full w-full bg-[rgb(0_0_0_/_40%)] transition-[background-color] duration-200"
      @click="handleClickMask"
    ></div>
  </div>
</template>
