import { nextTick, onMounted, onActivated } from 'vue'

export const onMountedOrActivated = (hook: AnyFunction<any>) => {
  let mounted: boolean

  onMounted(() => {
    hook()
    nextTick(() => {
      mounted = true
    })
  })

  onActivated(() => {
    if (mounted) {
      hook()
    }
  })
}

export { tryOnUnmounted, tryOnMounted } from '@vueuse/core'
