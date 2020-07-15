import { ref, computed, Ref, unref } from 'compatible-vue';
import { useEvent } from './useEvent';
import { screenMap, sizeEnum, screenEnum } from '@/enums/breakpointEnum';

let globalScreenRef: Ref<sizeEnum | undefined>;
let globalWidthRef: Ref<number>;

export function useBreakpoint() {
  return {
    screenRef: globalScreenRef,
    widthRef: globalWidthRef,
    screenEnum,
  };
}

// 只要调用一次即可
export function createBreakpointListen(fn?: (...arg) => any) {
  const screenRef = ref<sizeEnum>();

  function getWindowWidth() {
    const width = document.body.clientWidth;
    const xs = screenMap.get(sizeEnum.XS)!;
    const sm = screenMap.get(sizeEnum.SM)!;
    const md = screenMap.get(sizeEnum.MD)!;
    const lg = screenMap.get(sizeEnum.LG)!;
    const xl = screenMap.get(sizeEnum.XL)!;
    if (width < xs) {
      screenRef.value = sizeEnum.XS;
    } else if (width < sm) {
      screenRef.value = sizeEnum.SM;
    } else if (width < md) {
      screenRef.value = sizeEnum.MD;
    } else if (width < lg) {
      screenRef.value = sizeEnum.LG;
    } else if (width < xl) {
      screenRef.value = sizeEnum.XL;
    } else {
      screenRef.value = sizeEnum.XXL;
    }
  }
  useEvent({
    el: window,
    name: 'resize',
    listener: () => {
      fn && fn();
      getWindowWidth();
    },
    autoRemove: true,
  });

  getWindowWidth();
  globalScreenRef = computed(() => unref(screenRef));
  globalWidthRef = computed((): number => screenMap.get(unref(screenRef)!)!);
  return {
    screenRef: globalScreenRef,
    screenEnum,
    widthRef: globalWidthRef,
  };
}
