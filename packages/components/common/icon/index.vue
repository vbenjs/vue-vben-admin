<script setup lang="ts">
import type { PropType, CSSProperties } from 'vue'
import { ref, watch, onMounted, nextTick, unref, computed, useAttrs } from 'vue'
import { createBEM, isString } from '@pkg/utils'
import Iconify from '@purge-icons/generated'

const props = defineProps({
  // icon name
  icon: { type: String },
  // icon color
  color: { type: String },
  // icon size
  size: {
    type: [String, Number] as PropType<string | number>,
    default: 16,
  },
  spin: { type: Boolean },
  prefix: { type: String, default: '' },
})

const [bem] = createBEM('iconify')

const attrs = useAttrs()

const elRef = ref(null)

const getIcon = computed(
  () => `${props.prefix ? props.prefix + ':' : ''}${props.icon}`,
)

const update = async () => {
  const el = unref(elRef)
  if (!el) return

  await nextTick()
  const icon = unref(getIcon)
  if (!icon) return

  const svg = Iconify.renderSVG(icon, {})
  if (svg) {
    el.textContent = ''
    el.appendChild(svg)
  } else {
    const span = document.createElement('span')
    span.className = 'iconify'
    span.dataset.icon = icon
    el.textContent = ''
    el.appendChild(span)
  }
}

const wrapStyle = computed((): CSSProperties => {
  const { size, color } = props
  let _size = size
  if (isString(size)) {
    _size = parseInt(size, 10)
  }

  return {
    fontSize: `${_size}px`,
    color: color,
    display: 'inline-flex',
  }
})

const classes = computed(() => {
  const cls = [bem(), unref(attrs).class]
  if (props.spin) {
    cls.push(bem('spin'))
  }
  return cls
})

watch(() => props.icon, update, { flush: 'post' })

onMounted(update)
</script>

<template>
  <span ref="elRef" :class="classes" :style="wrapStyle"></span>
</template>

<style lang="less">
@prefix-cls: ~'@{namespace}-iconify';

.@{prefix-cls} {
  display: inline-block;

  &__spin {
    animation: loadingCircle 1s infinite linear;
  }
}

span.iconify {
  display: block;
  min-width: 1em;
  min-height: 1em;
  background-color: @iconify-bg-color;
  border-radius: 100%;
}
</style>
