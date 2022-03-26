<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, useAttrs, unref } from 'vue'
import { createBEM } from '@pkg/utils'

const attrs = useAttrs()

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 16,
  },
  spin: {
    type: Boolean,
    default: false,
  },
})

const [bem] = createBEM('svg-icon')

const symbolId = computed(() => `#${props.prefix}-${props.icon}`)

const classes = computed(() => {
  const cls = [bem(), unref(attrs).class]
  if (props.spin) {
    cls.push(bem('spin'))
  }
  return cls
})

const svgStyle = computed((): CSSProperties => {
  const { size } = props
  let _size = `${size}`
  _size = `${_size.replace('px', '')}px`
  return {
    width: _size,
    height: _size,
  }
})
</script>

<template>
  <svg :class="classes" :style="svgStyle" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-svg-icon';

.@{prefix-cls} {
  display: inline-block;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentColor;

  &__spin {
    animation: loadingCircle 1s infinite linear;
  }
}
</style>
