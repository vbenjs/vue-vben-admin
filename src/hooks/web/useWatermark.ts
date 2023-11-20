import { getCurrentInstance, onBeforeUnmount, ref, Ref, shallowRef, unref } from 'vue';
import { useRafThrottle } from '@/utils/domUtils';
import { addResizeListener, removeResizeListener } from '@/utils/event';
import { isDef } from '@/utils/is';

const watermarkSymbol = 'watermark-dom';

type UseWatermarkRes = {
  setWatermark: (str: string) => void;
  clear: () => void;
  clearAll: () => void;
};

const sourceMap = new Map<Symbol, Omit<UseWatermarkRes, 'clearAll'>>();

export function useWatermark(
  appendEl: Ref<HTMLElement | null> = ref(document.body) as Ref<HTMLElement>,
): UseWatermarkRes {
  const domSymbol = Symbol(watermarkSymbol);
  const appendElRaw = unref(appendEl);
  if (appendElRaw && sourceMap.has(domSymbol)) {
    const { setWatermark, clear } = sourceMap.get(domSymbol) as UseWatermarkRes;
    return { setWatermark, clear, clearAll };
  }
  const func = useRafThrottle(function () {
    const el = unref(appendEl);
    if (!el) return;
    const { clientHeight: height, clientWidth: width } = el;
    updateWatermark({ height, width });
  });
  const watermarkEl = shallowRef<HTMLElement>();

  const clear = () => {
    const domId = unref(watermarkEl);
    watermarkEl.value = undefined;
    const el = unref(appendEl);
    sourceMap.delete(domSymbol);
    if (!el) return;
    domId && el.removeChild(domId);
    removeResizeListener(el, func);
  };

  function createBase64(str: string) {
    const can = document.createElement('canvas');
    const width = 300;
    const height = 240;
    Object.assign(can, { width, height });

    const cans = can.getContext('2d');
    if (cans) {
      cans.rotate((-20 * Math.PI) / 120);
      cans.font = '15px Vedana';
      cans.fillStyle = 'rgba(0, 0, 0, 0.15)';
      cans.textAlign = 'left';
      cans.textBaseline = 'middle';
      cans.fillText(str, width / 20, height);
    }
    return can.toDataURL('image/png');
  }

  function updateWatermark(
    options: {
      width?: number;
      height?: number;
      str?: string;
    } = {},
  ) {
    const el = unref(watermarkEl);
    if (!el) return;
    if (isDef(options.width)) {
      el.style.width = `${options.width}px`;
    }
    if (isDef(options.height)) {
      el.style.height = `${options.height}px`;
    }
    if (isDef(options.str)) {
      el.style.background = `url(${createBase64(options.str)}) left top repeat`;
    }
  }

  const createWatermark = (str: string) => {
    if (unref(watermarkEl) && sourceMap.has(domSymbol)) {
      updateWatermark({ str });
      return;
    }
    const div = document.createElement('div');
    watermarkEl.value = div;
    div.style.pointerEvents = 'none';
    div.style.top = '0px';
    div.style.left = '0px';
    div.style.position = 'absolute';
    div.style.zIndex = '100000';
    const el = unref(appendEl);
    if (!el) return;
    const { clientHeight: height, clientWidth: width } = el;
    updateWatermark({ str, width, height });
    el.appendChild(div);
    sourceMap.set(domSymbol, { setWatermark, clear });
  };

  function setWatermark(str: string) {
    createWatermark(str);
    addResizeListener(document.documentElement, func);
    const instance = getCurrentInstance();
    if (instance) {
      onBeforeUnmount(() => {
        clear();
      });
    }
  }

  return { setWatermark, clear, clearAll };
}

function clearAll() {
  Array.from(sourceMap.values()).forEach((item) => {
    item.clear();
  });
}
