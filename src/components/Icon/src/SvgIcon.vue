<template>
  <svg
    :class="[prefixCls, $attrs.class, spin && 'svg-icon-spin']"
    :style="getStyle"
    aria-hidden="true"
  >
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script lang="ts" setup name="SvgIcon">
  import type { CSSProperties } from 'vue';
  import { computed } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { propTypes } from '/@/utils/propTypes';

  const props = defineProps({
    prefix: propTypes.string.def('icon'),
    // svg 图标名
    name: propTypes.string.isRequired,
    // svg 图标大小
    size: propTypes.oneOfType([propTypes.number, propTypes.string]).def(16),
    spin: propTypes.bool.def(false),
  });

  const { prefixCls } = useDesign('svg-icon');
  const symbolId = computed(() => `#${props.prefix}-${props.name}`);

  const getStyle = computed((): CSSProperties => {
    const { size } = props;
    let s = `${size}`;
    s = `${s.replace('px', '')}px`;
    return {
      width: s,
      height: s,
    };
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-svg-icon';

  .@{prefix-cls} {
    display: inline-block;
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentColor;
  }

  .svg-icon-spin {
    animation: loadingCircle 1s infinite linear;
  }
</style>
