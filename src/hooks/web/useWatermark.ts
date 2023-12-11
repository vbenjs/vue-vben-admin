import { getCurrentInstance, onBeforeUnmount, ref, Ref, shallowRef, unref } from 'vue';
import { useRafThrottle } from '@/utils/domUtils';
import { addResizeListener, removeResizeListener } from '@/utils/event';
import { isDef } from '@/utils/is';

const watermarkSymbol = 'watermark-dom';
const updateWatermarkText = ref<string | null>(null);

type UseWatermarkRes = {
  setWatermark: (str: string) => void;
  clear: () => void;
  clearAll: () => void;
  obInstance?: MutationObserver;
  targetElement?: HTMLElement;
  parentElement?: HTMLElement;
};

const sourceMap = new Map<Symbol, Omit<UseWatermarkRes, 'clearAll'>>();

function createBase64(str: string) {
  const can = document.createElement('canvas');
  const width = 300;
  const height = 240;
  Object.assign(can, { width, height });

  const cans = can.getContext('2d');
  if (cans) {
    cans.rotate((-20 * Math.PI) / 180);
    cans.font = '15px Vedana';
    cans.fillStyle = 'rgba(0, 0, 0, 0.15)';
    cans.textAlign = 'left';
    cans.textBaseline = 'middle';
    cans.fillText(str, width / 20, height);
    // todo 自定义水印样式
  }
  return can.toDataURL('image/png');
}
const resetWatermarkStyle = (element: HTMLElement, watermarkText: string) => {
  element.className = '__' + watermarkSymbol;
  element.style.pointerEvents = 'none';
  element.style.top = '0px';
  element.style.left = '0px';
  element.style.position = 'absolute';
  element.style.zIndex = '100000';
  element.style.height = '100%';
  element.style.width = '100%';
  element.style.background = `url(${createBase64(
    unref(updateWatermarkText) || watermarkText,
  )}) left top repeat`;
};

const obFn = () => {
  const obInstance = new MutationObserver((mutationRecords) => {
    for (const mutation of mutationRecords) {
      for (const node of Array.from(mutation.removedNodes)) {
        const target = Array.from(sourceMap.values()).find((item) => item.targetElement === node);
        if (!target) return;
        const { targetElement, parentElement } = target;
        // 父元素的子元素水印如果被删除 重新插入被删除的水印(防篡改，插入通过控制台删除的水印)
        if (!parentElement?.contains(targetElement as Node | null)) {
          target?.parentElement?.appendChild(node as HTMLElement);
        }
      }
      if (mutation.attributeName === 'style' && mutation.target) {
        const _target = mutation.target as HTMLElement;
        if (_target.className === '__' + watermarkSymbol) {
          resetWatermarkStyle(_target as HTMLElement, _target?.['data-watermark-text']);
        }
      }
    }
  });
  return obInstance;
};

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
    sourceMap.has(domSymbol) && sourceMap.get(domSymbol)?.obInstance?.disconnect();
    sourceMap.delete(domSymbol);
    if (!el) return;
    domId && el.removeChild(domId);
    removeResizeListener(el, func);
  };

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
      updateWatermarkText.value = str;
      updateWatermark({ str });
      return;
    }
    const div = document.createElement('div');
    div['data-watermark-text'] = str; //自定义属性 用于恢复水印
    updateWatermarkText.value = str;
    watermarkEl.value = div;
    resetWatermarkStyle(div, str);
    const el = unref(appendEl);
    if (!el) return;
    const { clientHeight: height, clientWidth: width } = el;
    updateWatermark({ str, width, height });
    el.appendChild(div);
    sourceMap.set(domSymbol, {
      setWatermark,
      clear,
      parentElement: el,
      targetElement: div,
      obInstance: obFn(),
    });
    sourceMap.get(domSymbol)?.obInstance?.observe(el, {
      childList: true, // 子节点的变动（指新增，删除或者更改）
      subtree: true, // 该观察器应用于该节点的所有后代节点
      attributes: true, // 属性的变动
    });
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
    item?.obInstance?.disconnect();
    item.clear();
  });
}
