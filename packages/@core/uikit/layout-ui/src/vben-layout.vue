<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed, ref, watch } from 'vue';

import { useMouse, useScroll, useThrottleFn } from '@vueuse/core';

import {
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSidebar,
  LayoutTabbar,
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
  // headerBackgroundColor: 'hsl(var(--background))',
  headerHeight: 50,
  headerHeightOffset: 10,
  headerHidden: false,

  headerMode: 'fixed',
  headerVisible: true,
  isMobile: false,
  layout: 'sidebar-nav',
  // sideCollapse: false,
  sideCollapseWidth: 60,
  sidebarCollapseShowTitle: false,
  sidebarHidden: false,
  sidebarMixedWidth: 80,
  sidebarSemiDark: true,
  sidebarTheme: 'dark',
  sidebarWidth: 180,
  tabbarEnable: true,
  // tabsBackgroundColor: 'hsl(var(--background))',
  tabsHeight: 36,
  zIndex: 200,
});

const emit = defineEmits<{ sideMouseLeave: []; toggleSidebar: [] }>();
const sidebarCollapse = defineModel<boolean>('sidebarCollapse');
const sidebarExtraVisible = defineModel<boolean>('sidebarExtraVisible');
const sidebarExtraCollapse = defineModel<boolean>('sidebarExtraCollapse');
const sidebarExpandOnHover = defineModel<boolean>('sidebarExpandOnHover');
const sidebarEnable = defineModel<boolean>('sidebarEnable', { default: true });

const {
  arrivedState,
  directions,
  isScrolling,
  y: scrollY,
} = useScroll(document);
const { y: mouseY } = useMouse({ type: 'client' });

// side是否处于hover状态展开菜单中
const sidebarExpandOnHovering = ref(false);
// const sideHidden = ref(false);
const headerIsHidden = ref(false);

const realLayout = computed(() => {
  return props.isMobile ? 'sidebar-nav' : props.layout;
});

/**
 * 是否全屏显示content，不需要侧边、底部、顶部、tab区域
 */
const fullContent = computed(() => realLayout.value === 'full-content');

/**
 * 是否侧边混合模式
 */
const isSidebarMixedNav = computed(
  () => realLayout.value === 'sidebar-mixed-nav',
);

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
  if (props.tabbarEnable) {
    height += props.tabsHeight;
  }
  return height;
});

const getSideCollapseWidth = computed(() => {
  const { sideCollapseWidth, sidebarCollapseShowTitle, sidebarMixedWidth } =
    props;
  return sidebarCollapseShowTitle || isSidebarMixedNav.value
    ? sidebarMixedWidth
    : sideCollapseWidth;
});

/**
 * 动态获取侧边区域是否可见
 */
const sidebarEnableState = computed(() => {
  return !isHeaderNav.value && sidebarEnable.value;
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
const getSidebarWidth = computed(() => {
  const { isMobile, sidebarHidden, sidebarMixedWidth, sidebarWidth } = props;
  let width = 0;

  if (sidebarHidden) {
    return width;
  }

  if (
    !sidebarEnableState.value ||
    (sidebarHidden && !isSidebarMixedNav.value && !isMixedNav.value)
  ) {
    return width;
  }

  if (isSidebarMixedNav.value && !isMobile) {
    width = sidebarMixedWidth;
  } else if (sidebarCollapse.value) {
    width = isMobile ? 0 : getSideCollapseWidth.value;
  } else {
    width = sidebarWidth;
  }
  return width;
});

/**
 * 获取扩展区域宽度
 */
const getExtraWidth = computed(() => {
  const { sidebarWidth } = props;
  return sidebarExtraCollapse.value ? getSideCollapseWidth.value : sidebarWidth;
});

/**
 * 是否侧边栏模式，包含混合侧边
 */
const isSideMode = computed(() =>
  ['mixed-nav', 'sidebar-mixed-nav', 'sidebar-nav'].includes(realLayout.value),
);

const showSidebar = computed(() => {
  // if (isMixedNav.value && !props.sideHidden) {
  //   return false;
  // }
  return isSideMode.value && sidebarEnable.value;
});

const sidebarFace = computed(() => {
  const { sidebarSemiDark, sidebarTheme } = props;
  const isDark = sidebarTheme === 'dark' || sidebarSemiDark;

  let backgroundColor = '';
  let extraBackgroundColor = '';

  if (isDark) {
    backgroundColor = isSidebarMixedNav.value
      ? 'hsl(var(--menu-dark-darken))'
      : 'hsl(var(--menu-dark))';
  } else {
    backgroundColor = isSidebarMixedNav.value
      ? 'hsl(var(--menu-darken))'
      : 'hsl(var(--menu))';
  }

  extraBackgroundColor = isDark ? 'hsl(var(--menu-dark))' : 'hsl(var(--menu))';

  return {
    backgroundColor,
    extraBackgroundColor,
    theme: isDark ? 'dark' : 'light',
  };
});

/**
 * 遮罩可见性
 */
const maskVisible = computed(() => !sidebarCollapse.value && props.isMobile);

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
  let sidebarAndExtraWidth = 'unset';
  if (
    headerFixed.value &&
    !['header-nav', 'mixed-nav'].includes(realLayout.value) &&
    showSidebar.value &&
    !props.isMobile
  ) {
    // fixed模式下生效
    const isSideNavEffective =
      isSidebarMixedNav.value &&
      sidebarExpandOnHover.value &&
      sidebarExtraVisible.value;

    if (isSideNavEffective) {
      const sideCollapseWidth = sidebarCollapse.value
        ? getSideCollapseWidth.value
        : props.sidebarMixedWidth;
      const sideWidth = sidebarExtraCollapse.value
        ? getSideCollapseWidth.value
        : props.sidebarWidth;

      // 100% - 侧边菜单混合宽度 - 菜单宽度
      sidebarAndExtraWidth = `${sideCollapseWidth + sideWidth}px`;
      width = `calc(100% - ${sidebarAndExtraWidth})`;
    } else {
      sidebarAndExtraWidth =
        sidebarExpandOnHovering.value && !sidebarExpandOnHover.value
          ? `${getSideCollapseWidth.value}px`
          : `${getSidebarWidth.value}px`;
      width = `calc(100% - ${sidebarAndExtraWidth})`;
    }
  }
  return {
    sidebarAndExtraWidth,
    width,
  };
});

const tabbarStyle = computed((): CSSProperties => {
  let width = '';
  let marginLeft = 0;

  if (!isMixedNav.value) {
    width = '100%';
  } else if (sidebarEnable.value) {
    marginLeft = sidebarCollapse.value
      ? getSideCollapseWidth.value
      : props.sidebarWidth;
    width = `calc(100% - ${getSidebarWidth.value}px)`;
  } else {
    width = '100%';
  }

  return {
    marginLeft: `${marginLeft}px`,
    width,
  };
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
    left: isMixedNav.value ? 0 : mainStyle.value.sidebarAndExtraWidth,
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
const sidebarZIndex = computed(() => {
  const { isMobile, zIndex } = props;
  const offset = isMobile || isSideMode.value ? 1 : -1;
  return zIndex + offset;
});

const footerWidth = computed(() => {
  if (!props.footerFixed) {
    return '100%';
  }

  return mainStyle.value.width;
});

const maskStyle = computed((): CSSProperties => {
  return { zIndex: props.zIndex };
});

const showHeaderToggleButton = computed(() => {
  return (
    isSideMode.value &&
    !isSidebarMixedNav.value &&
    !isMixedNav.value &&
    !props.isMobile
  );
});

const showHeaderLogo = computed(() => {
  return !isSideMode.value || isMixedNav.value || props.isMobile;
});

watch(
  () => props.isMobile,
  (val) => {
    sidebarCollapse.value = val;
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
  sidebarCollapse.value = true;
}

function handleToggleSidebar() {
  emit('toggleSidebar');
}

function handleOpenMenu() {
  sidebarCollapse.value = false;
}
</script>

<template>
  <div class="relative flex min-h-full w-full">
    <slot name="preferences"></slot>
    <slot name="floating-groups"></slot>
    <LayoutSidebar
      v-if="sidebarEnableState"
      v-model:collapse="sidebarCollapse"
      v-model:expand-on-hover="sidebarExpandOnHover"
      v-model:expand-on-hovering="sidebarExpandOnHovering"
      v-model:extra-collapse="sidebarExtraCollapse"
      v-model:extra-visible="sidebarExtraVisible"
      :collapse-width="getSideCollapseWidth"
      :dom-visible="!isMobile"
      :extra-width="getExtraWidth"
      :fixed-extra="sidebarExpandOnHover"
      :header-height="isMixedNav ? 0 : getHeaderHeight"
      :is-sidebar-mixed="isSidebarMixedNav"
      :mixed-width="sidebarMixedWidth"
      :padding-top="sidePaddingTop"
      :show="showSidebar"
      :width="getSidebarWidth"
      :z-index="sidebarZIndex"
      v-bind="sidebarFace"
      @leave="() => emit('sideMouseLeave')"
    >
      <template v-if="isSideMode && !isMixedNav" #logo>
        <slot name="logo"></slot>
      </template>

      <template v-if="isSidebarMixedNav">
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
    </LayoutSidebar>

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
          :sidebar-width="sidebarWidth"
          :width="mainStyle.width"
          :z-index="headerZIndex"
          @open-menu="handleOpenMenu"
          @toggle-sidebar="handleToggleSidebar"
        >
          <template v-if="showHeaderLogo" #logo>
            <slot name="logo"></slot>
          </template>
          <slot name="header"></slot>
        </LayoutHeader>

        <LayoutTabbar
          v-if="tabbarEnable"
          :height="tabsHeight"
          :style="tabbarStyle"
        >
          <slot name="tabbar"></slot>
          <template #toolbar>
            <slot name="tabbar-tools"></slot>
          </template>
        </LayoutTabbar>
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
