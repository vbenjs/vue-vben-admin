<script lang="ts">
import type { PropType } from 'vue'
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  nextTick,
  unref,
  computed,
  CSSProperties,
} from 'vue'
import Iconify from '@purge-icons/generated'
import { isString } from '@pkg/utils'

export default defineComponent({
  name: 'Icon',
  props: {
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
  },
  setup(props) {
    const elRef = ref<ElRef>(null)

    const getIconRef = computed(
      () => `${props.prefix ? props.prefix + ':' : ''}${props.icon}`,
    )

    const update = async () => {
      const el = unref(elRef)
      if (!el) return

      await nextTick()
      const icon = unref(getIconRef)
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

    const getWrapStyle = computed((): CSSProperties => {
      const { size, color } = props
      let fs = size
      if (isString(size)) {
        fs = parseInt(size, 10)
      }

      return {
        fontSize: `${fs}px`,
        color: color,
        display: 'inline-flex',
      }
    })

    watch(() => props.icon, update, { flush: 'post' })

    onMounted(update)

    return { elRef, getWrapStyle }
  },
})
</script>

<template>
  <span
    ref="elRef"
    :class="[$attrs.class, 'app-iconify anticon', spin && 'app-iconify-spin']"
    :style="getWrapStyle"
  ></span>
</template>

<style lang="less">
.app-iconify {
  display: inline-block;

  &-spin {
    svg {
      animation: loadingCircle 1s infinite linear;
    }
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
