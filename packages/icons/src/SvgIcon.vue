<script setup lang="ts">
  import { isString } from '@vben/shared';
  import { computed, type CSSProperties, useCssModule } from 'vue';

  defineOptions({
    name: 'VbenSvgIcon',
    inheritAttrs: false,
  });

  interface Props {
    /**
     * @description 图标名
     */
    icon: string;

    /**
     * @description 图标大小
     * @default 16
     */
    size?: number | string;

    /**
     * @description 图标集空间名
     * @default 'icon'
     */
    namespace?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 16,
    namespace: 'icon',
  });

  const $style = useCssModule();

  const symbolId = computed(() => {
    const { namespace, icon } = props;
    return `#${namespace}-${icon}`;
  });

  const svgIconStyles = computed((): CSSProperties => {
    const { size } = props;
    const wh = isString(size) ? `${Number.parseInt(size)}px` : `${size}px`;
    return {
      width: wh,
      height: wh,
    };
  });
</script>

<template>
  <svg v-bind="$attrs" :class="$style['svg-icon']" :style="svgIconStyles" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<style module scoped>
  .svg-icon {
    display: inline-block;
    overflow: hidden;
    fill: currentcolor;
    vertical-align: -0.15em;
  }
</style>
