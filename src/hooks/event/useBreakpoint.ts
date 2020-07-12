import { ref, computed, unref } from 'compatible-vue';
import { useEvent } from './useEvent';
import { screenMap, sizeEnum, screenEnum } from '@/enums/breakpointEnum';

export function useBreakpoint(fn?: (...arg) => any) {
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
  });
  getWindowWidth();
  return {
    screenRef: computed(() => unref(screenRef)),
    screenEnum,
    widthRef: computed((): number => screenMap.get(unref(screenRef)!)!),
  };
}
