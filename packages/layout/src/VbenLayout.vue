<script setup lang="ts">
  import { useNamespace } from '@vben/hooks';
  import type { CSSProperties } from 'vue';
  import { computed, watchEffect } from 'vue';

  import LayoutContent from './LayoutContent.vue';
  import LayoutFooter from './LayoutFooter.vue';
  import LayoutHeader from './LayoutHeader.vue';
  import LayoutSide from './LayoutSide.vue';

  defineOptions({
    name: 'VbenLayout',
  });

  interface Props {
    /**
     * 布局方式
     * side-nav 侧边菜单布局
     * header-nav 顶部菜单布局
     * mixed-nav 侧边&顶部菜单布局
     * side-mixed-nav 侧边混合菜单布局
     * full-content 全屏内容布局
     * @default side-nav
     */
    layout?: 'side-nav' | 'header-nav' | 'mixed-nav' | 'side-mixed-nav' | 'full-content';
    /**
     * 是否移动端显示
     * @default false
     */
    isMobile?: boolean;
    /**
     * zIndex
     * @default 100
     */
    zIndex?: number;
    /**
     * header是否显示
     * @default true
     */
    headerVisible?: boolean;
    /**
     * header高度
     * @default 60
     */
    headerHeight?: number;
    /**
     * header是否固定在顶部
     * @default true
     */
    headerFixed?: boolean;
    /**
     * 背景颜色
     * @default #fff
     */
    headerBackgroundColor?: string;
    /**
     * 侧边栏是否可见
     * @default true
     */
    sideVisible?: boolean;
    /**
     * 侧边栏宽度
     * @default 180
     */
    sideWidth?: number;
    /**
     * 混合侧边栏宽度
     * @default 80
     */
    sideMixedWidth?: number;
    /**
     * 侧边栏背景颜色
     * @default #fff
     */
    sideBackgroundColor?: string;
    /**
     * 侧边菜单折叠状态
     * @default false
     */
    sideCollapse?: boolean;
    /**
     *  侧边菜单折叠宽度
     * @default 48
     */
    sideCollapseWidth?: number;
    /**
     * padding
     * @default 16
     */
    contentPadding?: number;
    /**
     * paddingBottom
     * @default 16
     */
    contentPaddingBottom?: number;
    /**
     * paddingTop
     * @default 16
     */
    contentPaddingTop?: number;
    /**
     * paddingLeft
     * @default 16
     */
    contentPaddingLeft?: number;
    /**
     * paddingRight
     * @default 16
     */
    contentPaddingRight?: number;
    /**
     * footer 是否可见
     * @default false
     */
    footerVisible?: boolean;
    /**
     * footer 高度
     * @default 32
     */
    footerHeight?: number;
    /**
     * footer 是否固定
     * @default true
     */
    footerFixed?: boolean;
    /**
     * footer背景颜色
     * @default #fff
     */
    footerBackgroundColor?: string;
    /**
     * 混合侧边扩展区域是否可见
     * @default false
     */
    mixedExtraVisible?: boolean;
    /**
     * 固定混合侧边菜单
     * @default false
     */
    fixedMixedExtra?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    layout: 'side-nav',
    zIndex: 1000,
    isMobile: false,
    headerVisible: true,
    headerHeight: 60,
    headerFixed: true,
    headerBackgroundColor: 'red',
    sideVisible: true,
    sideWidth: 180,
    sideMixedWidth: 80,
    sideCollapse: false,
    sideCollapseWidth: 48,
    sideBackgroundColor: 'green',
    contentPadding: 16,
    contentPaddingBottom: 16,
    contentPaddingTop: 16,
    contentPaddingLeft: 16,
    contentPaddingRight: 16,
    footerBackgroundColor: 'yellow',
    footerHeight: 32,
    footerFixed: true,
    footerVisible: true,
    mixedExtraVisible: false,
    fixedMixedExtra: false,
  });

  const emit = defineEmits(['update:mixed-extra-visible', 'update:side-collapse']);

  const { b, e } = useNamespace('layout');

  const sideCollapseState = computed({
    get() {
      return props.sideCollapse;
    },
    set(collapse) {
      emit('update:side-collapse', collapse);
    },
  });

  /**
   * 动态获取侧边区域是否可见
   */
  const getSideVisible = computed(() => {
    const { layout, sideVisible } = props;
    return layout !== 'header-nav' && sideVisible;
  });

  /**
   * 侧边区域离顶部高度
   */
  const sidePaddingTop = computed(() => {
    const { layout, headerHeight, isMobile } = props;
    return layout === 'mixed-nav' && !isMobile ? headerHeight : 0;
  });

  /**
   * 动态获取侧边宽度
   */
  const getSiderWidth = computed(() => {
    const { layout, sideWidth, isMobile, sideCollapseWidth, sideMixedWidth } = props;
    let width = 0;
    if (sideCollapseState.value) {
      width = isMobile ? 0 : sideCollapseWidth;
    } else {
      if (layout === 'side-mixed-nav') {
        width = sideMixedWidth;
      } else {
        width = sideWidth;
      }
    }
    return width;
  });

  /**
   * 是否侧边栏模式，包含混合侧边
   */
  const isSideMode = computed(() => ['side-nav', 'side-mixed-nav'].includes(props.layout));

  /**
   * 是否全屏显示content，不需要侧边、底部、顶部、tab区域
   */
  const fullContent = computed(() => props.layout === 'full-content');

  /**
   * 是否侧边混合模式
   */
  const isSideMixed = computed(() => props.layout === 'side-mixed-nav');

  /**
   * 遮罩可见性
   */
  const maskVisible = computed(() => !sideCollapseState.value && props.isMobile);

  /**
   * 侧边栏z-index
   */
  const sideZIndex = computed(() => {
    const { zIndex, isMobile } = props;
    const offset = isMobile || isSideMode.value ? 1 : -1;
    return zIndex + offset;
  });

  const maskStyle = computed((): CSSProperties => {
    return {
      zIndex: props.zIndex,
    };
  });

  watchEffect(() => {
    sideCollapseState.value = props.isMobile;
  });

  function handleExtraVisible(visible: boolean) {
    emit('update:mixed-extra-visible', visible);
  }

  function handleClickMask() {
    sideCollapseState.value = true;
  }
</script>

<template>
  <div :class="b()">
    <LayoutSide
      v-if="getSideVisible"
      :show="!fullContent"
      :width="getSiderWidth"
      :sideExtraWidth="sideWidth"
      :mixedExtraVisible="mixedExtraVisible"
      :zIndex="sideZIndex"
      :domVisible="!isMobile"
      :isSideMixed="isSideMixed"
      :paddingTop="sidePaddingTop"
      :fixedMixedExtra="fixedMixedExtra"
      :backgroundColor="sideBackgroundColor"
      @extra-visible="handleExtraVisible"
    >
      <slot name="side"></slot>
      <template #extra>
        <slot name="side-extra"></slot>
      </template>
    </LayoutSide>

    <div :class="e('main')">
      <LayoutHeader
        v-if="headerVisible"
        :show="!fullContent"
        :zIndex="zIndex"
        :height="headerHeight"
        :fixed="headerFixed"
        :fullWidth="!isSideMode"
        :backgroundColor="headerBackgroundColor"
      >
        <slot name="header"></slot>
      </LayoutHeader>

      <LayoutContent
        :padding="contentPadding"
        :paddingTop="contentPaddingTop"
        :paddingRight="contentPaddingRight"
        :paddingBottom="contentPaddingBottom"
        :paddingLeft="contentPaddingLeft"
      >
        <slot name="content"></slot>
      </LayoutContent>

      <LayoutFooter
        v-if="footerVisible"
        :show="!fullContent"
        :zIndex="zIndex"
        :height="footerHeight"
        :fixed="footerFixed"
        :backgroundColor="footerBackgroundColor"
      >
        <slot name="footer"></slot>
      </LayoutFooter>
    </div>

    <div v-if="maskVisible" :class="e('mask')" :style="maskStyle" @click="handleClickMask"></div>
  </div>
</template>

<style scoped module lang="scss">
  @include b('layout') {
    display: flex;

    @include e('main') {
      display: flex;
      flex: auto;
      flex-direction: column;
    }

    @include e('mask') {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgb(0 0 0 / 40%);
      transition: background-color 0.2s;
    }
  }
</style>
