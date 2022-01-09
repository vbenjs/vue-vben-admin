import { ref, computed, ComputedRef, unref } from 'vue'
import { useEventListener } from '@/hooks/event/useEventListener'
import { screenMap, ScreenSizeEnum, ScreenValueEnum } from '@admin/tokens'

let globalScreenRef: ComputedRef<ScreenSizeEnum | undefined>
let globalWidthRef: ComputedRef<number>
let globalRealWidthRef: ComputedRef<number>

export interface CreateCallbackParams {
  screen: ComputedRef<ScreenSizeEnum | undefined>
  width: ComputedRef<number>
  realWidth: ComputedRef<number>
  screenEnum: typeof ScreenValueEnum
  screenMap: Map<ScreenSizeEnum, number>
  sizeEnum: typeof ScreenSizeEnum
}

export function useBreakpoint() {
  return {
    screenRef: computed(() => unref(globalScreenRef)),
    widthRef: globalWidthRef,
    screenEnum: ScreenValueEnum,
    realWidthRef: globalRealWidthRef,
  }
}

// Just call it once
export function createBreakpointListen(
  fn?: (opt: CreateCallbackParams) => void,
) {
  const screenRef = ref<ScreenSizeEnum>(ScreenSizeEnum.XL)
  const realWidthRef = ref(window.innerWidth)

  function getWindowWidth() {
    const width = document.body.clientWidth
    const xs = screenMap.get(ScreenSizeEnum.XS)!
    const sm = screenMap.get(ScreenSizeEnum.SM)!
    const md = screenMap.get(ScreenSizeEnum.MD)!
    const lg = screenMap.get(ScreenSizeEnum.LG)!
    const xl = screenMap.get(ScreenSizeEnum.XL)!
    if (width < xs) {
      screenRef.value = ScreenSizeEnum.XS
    } else if (width < sm) {
      screenRef.value = ScreenSizeEnum.SM
    } else if (width < md) {
      screenRef.value = ScreenSizeEnum.MD
    } else if (width < lg) {
      screenRef.value = ScreenSizeEnum.LG
    } else if (width < xl) {
      screenRef.value = ScreenSizeEnum.XL
    } else {
      screenRef.value = ScreenSizeEnum.XXL
    }
    realWidthRef.value = width
  }

  useEventListener({
    el: window,
    name: 'resize',

    listener: () => {
      getWindowWidth()
      resizeFn()
    },
    // wait: 100,
  })

  getWindowWidth()
  globalScreenRef = computed(() => unref(screenRef))
  globalWidthRef = computed((): number => screenMap.get(unref(screenRef)!)!)
  globalRealWidthRef = computed((): number => unref(realWidthRef))

  function resizeFn() {
    fn?.({
      screen: globalScreenRef,
      width: globalWidthRef,
      realWidth: globalRealWidthRef,
      screenEnum: ScreenValueEnum,
      screenMap,
      sizeEnum: ScreenSizeEnum,
    })
  }

  resizeFn()
  return {
    screenRef: globalScreenRef,
    screenEnum: ScreenValueEnum,
    widthRef: globalWidthRef,
    realWidthRef: globalRealWidthRef,
  }
}
