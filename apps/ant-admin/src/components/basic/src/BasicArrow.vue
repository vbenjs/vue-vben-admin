<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import { useDesign } from '@/hooks/web/useDesign'
import { RightOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  /**
   * Arrow expand state
   */
  expand: { type: Boolean },
  /**
   * Arrow up by default
   */
  up: { type: Boolean },
  /**
   * Arrow down by default
   */
  down: { type: Boolean },
  /**
   * Cancel padding/margin for inline
   */
  inset: { type: Boolean },

  iconStyle: { type: Object as PropType<CSSProperties> },
})

const { prefixCls } = useDesign('basic-arrow')

// get component class
const classes = computed(() => {
  const { expand, up, down, inset } = props
  return [
    prefixCls,
    {
      [`${prefixCls}--active`]: expand,
      up,
      inset,
      down,
    },
  ]
})
</script>

<template>
  <span :class="classes">
    <right-outlined :style="iconStyle" />
  </span>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-basic-arrow';

.@{prefix-cls} {
  display: inline-block;
  cursor: pointer;
  transform: rotate(0deg);
  transition: all 0.3s ease 0.1s;
  transform-origin: center center;

  &--active {
    transform: rotate(90deg);
  }

  &.inset {
    line-height: 0px;
  }

  &.up {
    transform: rotate(-90deg);
  }

  &.down {
    transform: rotate(90deg);
  }

  &.up.@{prefix-cls}--active {
    transform: rotate(90deg);
  }

  &.down.@{prefix-cls}--active {
    transform: rotate(-90deg);
  }
}
</style>
