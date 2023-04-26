<script setup lang="ts">
  import { useNamespace } from '@vben/hooks';
  import { onClickOutside } from '@vueuse/core';
  import type { CSSProperties } from 'vue';
  import { computed, ref, shallowRef, watchEffect } from 'vue';

  defineOptions({ name: 'VbenLayoutSide' });

  interface Props {
    /**
     * 是否显示
     * @default true
     */
    show?: boolean;
    /**
     * 隐藏的dom是否可见
     * @default true
     */
    domVisible?: boolean;
    /**
     * zIndex
     * @default 0
     */
    zIndex?: number;
    /**
     * 背景颜色
     */
    backgroundColor: string;
    /**
     * 宽度
     * @default 180
     */
    width?: number;
    /**
     * 扩展区域宽度
     * @default 180
     */
    sideExtraWidth?: number;
    /**
     * 固定扩展区域
     * @default false
     */
    fixedMixedExtra?: boolean;
    /**
     * 是否侧边混合模式
     * @default false
     */
    isSideMixed?: boolean;
    /**
     * 顶部padding
     * @default 60
     */
    paddingTop?: number;
    /**
     * 混合侧边扩展区域是否可见
     * @default false
     */
    mixedExtraVisible?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    show: true,
    zIndex: 0,
    width: 180,
    sideExtraWidth: 180,
    paddingTop: 60,
    isSideMixed: false,
    fixedMixedExtra: false,
    mixedExtraVisible: false,
    domVisible: true,
  });

  const { b, e } = useNamespace('layout-side');

  const emit = defineEmits(['extraVisible']);

  const asideRef = shallowRef<HTMLDivElement | null>();
  const extraVisible = ref(false);

  const hiddenSideStyle = computed((): CSSProperties => {
    const { backgroundColor, width, show, fixedMixedExtra, isSideMixed, sideExtraWidth } = props;
    const widthValue = `${width + (isSideMixed && fixedMixedExtra ? sideExtraWidth : 0)}px`;

    return {
      marginLeft: show ? 0 : `-${widthValue}`,
      flex: `0 0 ${widthValue}`,
      width: widthValue,
      minWidth: widthValue,
      maxWidth: widthValue,
      backgroundColor,
    };
  });

  const style = computed((): CSSProperties => {
    const { paddingTop, zIndex } = props;
    return {
      ...hiddenSideStyle.value,
      paddingTop: `${paddingTop}px`,
      zIndex,
    };
  });

  const extraStyle = computed((): CSSProperties => {
    const { backgroundColor, zIndex, sideExtraWidth, width } = props;

    return {
      zIndex,
      left: `${width}px`,
      width: extraVisible.value ? `${sideExtraWidth}px` : 0,
      backgroundColor,
    };
  });

  watchEffect(() => {
    extraVisible.value = props.fixedMixedExtra ? true : props.mixedExtraVisible;
  });

  onClickOutside(asideRef, (event) => {
    const { fixedMixedExtra, width } = props;
    // 防止点击 aside 区域关闭
    if (!fixedMixedExtra && event.clientX >= width) {
      if (extraVisible.value) {
        emit('extraVisible', false);
      }
    }
  });
</script>

<template>
  <div v-if="domVisible" :style="hiddenSideStyle" :class="e('hide')"></div>
  <aside :style="style" :class="b()">
    <slot></slot>
    <div v-if="isSideMixed" ref="asideRef" :style="extraStyle" :class="e('extra')">
      <slot name="extra"></slot>
    </div>
  </aside>
</template>

<style scoped module lang="scss">
  @include b('layout-side') {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    overflow: hidden;
    box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
    transition: all 0.2s ease 0s;

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
    }
  }
</style>
