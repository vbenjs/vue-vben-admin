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
  waterMarkOptions?: waterMarkOptionsType;
  obInstance?: MutationObserver;
  targetElement?: HTMLElement;
  parentElement?: HTMLElement;
};

type waterMarkOptionsType = {
  // 自定义水印的文字大小
  fontSize?: number;
  // 自定义水印的文字颜色
  fontColor?: string;
  // 自定义水印的文字字体
  fontFamily?: string;
  // 自定义水印的文字对齐方式
  textAlign?: CanvasTextAlign;
  // 自定义水印的文字基线
  textBaseline?: CanvasTextBaseline;
  // 自定义水印的文字倾斜角度
  rotate?: number;
};

const sourceMap = new Map<Symbol, Omit<UseWatermarkRes, 'clearAll'>>();

function findTargetNode(el) {
  return Array.from(sourceMap.values()).find((item) => item.targetElement === el);
}

function createBase64(str: string, waterMarkOptions: waterMarkOptionsType) {
  const can = document.createElement('canvas');
  const width = 300;
  const height = 240;
  Object.assign(can, { width, height });

  const cans = can.getContext('2d');
  if (cans) {
    const fontFamily = waterMarkOptions?.fontFamily || 'Vedana';
    const fontSize = waterMarkOptions?.fontSize || 15;
    const fontColor = waterMarkOptions?.fontColor || 'rgba(0, 0, 0, 0.15)';
    const textAlign = waterMarkOptions?.textAlign || 'left';
    const textBaseline = waterMarkOptions?.textBaseline || 'middle';
    const rotate = waterMarkOptions?.rotate || 20;
    cans.rotate((-rotate * Math.PI) / 180);
    cans.font = `${fontSize}px ${fontFamily}`;
    cans.fillStyle = fontColor;
    cans.textAlign = textAlign;
    cans.textBaseline = textBaseline;
    cans.fillText(str, width / 20, height);
  }
  return can.toDataURL('image/png');
}
const resetWatermarkStyle = (
  element: HTMLElement,
  watermarkText: string,
  waterMarkOptions: waterMarkOptionsType,
) => {
  element.className = '__' + watermarkSymbol;
  element.style.pointerEvents = 'none';
  element.style.display = 'block';
  element.style.visibility = 'visible';
  element.style.top = '0px';
  element.style.left = '0px';
  element.style.position = 'absolute';
  element.style.zIndex = '100000';
  element.style.height = '100%';
  element.style.width = '100%';
  element.style.background = `url(${createBase64(
    unref(updateWatermarkText) || watermarkText,
    waterMarkOptions,
  )}) left top repeat`;
};

const obFn = () => {
  const obInstance = new MutationObserver((mutationRecords) => {
    for (const mutation of mutationRecords) {
      for (const node of Array.from(mutation.removedNodes)) {
        const target = findTargetNode(node);
        if (!target) return;
        const { targetElement, parentElement } = target;
        // 父元素的子元素水印如果被删除 重新插入被删除的水印(防篡改，插入通过控制台删除的水印)
        if (!parentElement?.contains(targetElement as Node | null)) {
          target?.parentElement?.appendChild(node as HTMLElement);
        }
      }
      if (mutation.type === 'attributes' && mutation.target) {
        // 修复控制台可以”Hide element” 的问题
        const _target = mutation.target as HTMLElement;
        const target = findTargetNode(_target);
        if (target) {
          // 禁止改属性 包括class 修改以后 mutation.type 也等于 'attributes'
          // 先解除监听 再加一下
          clearAll();
          target.setWatermark(target.targetElement?.['data-watermark-text']);
        }
      }
    }
  });
  return obInstance;
};

export function useWatermark(
  appendEl: Ref<HTMLElement | null> = ref(document.body) as Ref<HTMLElement>,
  waterMarkOptions: waterMarkOptionsType = {},
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
      el.style.background = `url(${createBase64(options.str, waterMarkOptions)}) left top repeat`;
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
    resetWatermarkStyle(div, str, waterMarkOptions);
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
      waterMarkOptions,
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
