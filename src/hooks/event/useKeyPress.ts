// https://ahooks.js.org/zh-CN/hooks/dom/use-key-press

import type { Ref } from 'vue';
import { onBeforeUnmount, onMounted, unref } from 'vue';
import { noop } from '/@/utils';
import { isFunction, isString, isNumber, isArray } from '/@/utils/is';

export type KeyPredicate = (event: KeyboardEvent) => boolean;
export type keyType = KeyboardEvent['keyCode'] | KeyboardEvent['key'];
export type KeyFilter = keyType | keyType[] | ((event: KeyboardEvent) => boolean);
export type EventHandler = (event: KeyboardEvent) => void;

export type keyEvent = 'keydown' | 'keyup';

export type TargetElement = HTMLElement | Element | Document | Window;
export type Target = Ref<TargetElement>;

export type EventOption = {
  events?: keyEvent[];
  target?: Target;
};

const defaultEvents: keyEvent[] = ['keydown'];

// 键盘事件 keyCode 别名
const aliasKeyCodeMap: Recordable<number | number[]> = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  delete: [8, 46],
};

// 键盘事件 key 别名
const aliasKeyMap: Recordable<string | string[]> = {
  esc: 'Escape',
  tab: 'Tab',
  enter: 'Enter',
  space: ' ',
  // IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  delete: ['Backspace', 'Delete'],
};

// 修饰键
const modifierKey: Recordable<(event: KeyboardEvent) => boolean> = {
  ctrl: (event: KeyboardEvent) => event.ctrlKey,
  shift: (event: KeyboardEvent) => event.shiftKey,
  alt: (event: KeyboardEvent) => event.altKey,
  meta: (event: KeyboardEvent) => event.metaKey,
};

/**
 * 判断按键是否激活
 * @param [event: KeyboardEvent]键盘事件
 * @param [keyFilter: any] 当前键
 * @returns Boolean
 */
function genFilterKey(event: any, keyFilter: any) {
  // 浏览器自动补全 input 的时候，会触发 keyDown、keyUp 事件，但此时 event.key 等为空
  if (!event.key) {
    return false;
  }

  // 数字类型直接匹配事件的 keyCode
  if (isNumber(keyFilter)) {
    return event.keyCode === keyFilter;
  }
  // 字符串依次判断是否有组合键
  const genArr = keyFilter.split('.');
  let genLen = 0;
  for (const key of genArr) {
    // 组合键
    const genModifier = modifierKey[key];
    // key 别名
    const aliasKey = aliasKeyMap[key];
    // keyCode 别名
    const aliasKeyCode = aliasKeyCodeMap[key];
    /**
     * 满足以上规则
     * 1. 自定义组合键别名
     * 2. 自定义 key 别名
     * 3. 自定义 keyCode 别名
     * 4. 匹配 key 或 keyCode
     */
    if (
      (genModifier && genModifier(event)) ||
      (aliasKey && isArray(aliasKey) ? aliasKey.includes(event.key) : aliasKey === event.key) ||
      (aliasKeyCode && isArray(aliasKeyCode)
        ? aliasKeyCode.includes(event.keyCode)
        : aliasKeyCode === event.keyCode) ||
      event.key.toUpperCase() === key.toUpperCase()
    ) {
      genLen++;
    }
  }
  return genLen === genArr.length;
}

/**
 * 键盘输入预处理方法
 */
function genKeyFormat(keyFilter: any): KeyPredicate {
  if (isFunction(keyFilter)) {
    return keyFilter;
  }
  if (isString(keyFilter) || isNumber(keyFilter)) {
    return (event: KeyboardEvent) => genFilterKey(event, keyFilter);
  }
  if (isArray(keyFilter)) {
    return (event: KeyboardEvent) => keyFilter.some((item: any) => genFilterKey(event, item));
  }
  return keyFilter ? () => true : () => false;
}

export function useKeyPress(
  keyFilter: KeyFilter,
  eventHandler: EventHandler = noop,
  option: EventOption = {}
) {
  const { events = defaultEvents, target } = option;

  let el: TargetElement | null | undefined;

  function handler(event: any) {
    const genGuard: KeyPredicate = genKeyFormat(keyFilter);
    if (genGuard(event)) {
      return eventHandler(event);
    }
  }

  onMounted(() => {
    el = getTargetElement(target, window);
    if (!el) return;

    for (const eventName of events) {
      el.addEventListener(eventName, handler);
    }
  });

  onBeforeUnmount(() => {
    if (!el) return;
    for (const eventName of events) {
      el.removeEventListener(eventName, handler);
    }
  });
}

export function getTargetElement(
  target?: Target,
  defaultElement?: TargetElement
): TargetElement | undefined | null {
  if (!target) {
    return defaultElement;
  }

  let targetElement: TargetElement | undefined | null;

  if (isFunction(target)) {
    targetElement = target();
  } else {
    targetElement = unref(target);
  }
  return targetElement;
}
