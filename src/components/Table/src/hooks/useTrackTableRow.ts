import { useEventListener } from '@vueuse/core';
import type { TableActionType } from '../types/table';
import {
  ref,
  type ComponentPublicInstance,
  type ComputedRef,
  type MaybeRef,
  unref,
  computed,
  toRaw,
  InjectionKey,
  provide,
  inject,
} from 'vue';
import { useDesign } from '@/hooks/web/useDesign';
import { useTableContext } from './useTableContext';
import { noop } from 'lodash-es';

const rowAttributeKey = 'data-row-key'; // AntDesignVue Table 挂载到 tr 上的属性
/**
 * @description 跟踪表格行信息
 */
interface UseTrackTableRowOptions {
  /**
   * @description 跟踪行信息的触发时机
   * @default 'click'
   */
  trigger?: 'click' | 'hover';
  /**
   * @description 跟踪行信息的拦截器，可以返回 false 阻止跟踪，在遇到一些特殊的场景时可能会有用
   */
  guard?: (ev: MouseEvent) => boolean | void;
  /**
   * @description 是否向下注入行信息，子组件可以使用 useTrackTableRowContext() 直接获取行信息
   */
  provide?: boolean;
}

const triggerToEventNameMap: Record<string, string> = {
  click: 'click',
  hover: 'mousemove',
};

export interface UseTrackTableRowReturn<Row = any> {
  row: ComputedRef<Row | null>;
  extend: (data: Partial<Row>) => void;
}

export function useTrackTableRow<Row extends Record<string, any>>(
  tableActionRef: MaybeRef<TableActionType | undefined>,
  options: UseTrackTableRowOptions = {},
) {
  const { guard, provide = false, trigger = 'click' } = options;

  const tableContext = useTableContext();
  const { prefixCls } = useDesign('basic-table');

  const row = ref<Row | null>(null);
  const extendInfo = ref<Partial<Row>>({});

  function trackRowInfo(ev: MouseEvent) {
    const shouldTrack = guard?.(ev) ?? true;
    if (!shouldTrack) return;

    const rowKey = findRowKeyByElement(ev.target);
    const rowInfo = tryGetRow(rowKey as string);
    (row as any).value = rowInfo;
  }

  function getRowKey(target: Element) {
    return target.getAttribute(rowAttributeKey);
  }

  function hasRowKey(target: Element) {
    return !!getRowKey(target);
  }

  function isRootElement(target: Element) {
    return target.classList.contains(prefixCls);
  }

  function findRowKeyByElement(target: EventTarget | null) {
    const rowKey = null;
    let current = target as Element;
    while (current) {
      if (isRootElement(current)) return null;

      if (hasRowKey(current)) return getRowKey(current);

      current = current.parentElement as Element;
    }
    return rowKey;
  }

  function tryGetRow(rowKey: string) {
    try {
      const tableAction = unref(tableActionRef);
      /**
       * support useTableContext
       */
      const row1 = tableContext?.getRowKeyToRowMap?.().get?.(rowKey as string);
      /**
       * support useTable and ref
       */
      const row2 = tableAction?.getRowKeyToRowMap?.().get?.(rowKey as string);
      /**
       * try guess row1 or row2 not empty
       */
      return row1 ?? row2 ?? null;
    } catch (error) {
      return null;
    }
  }

  function tryGetTableWrapperElement() {
    try {
      const tableAction = unref(tableActionRef);
      /**
       * support useTableContext
       */
      const el1 = tableContext?.getWrapperElement?.();
      /**
       * support useTable
       */
      const el2 = tableAction?.getWrapperElement?.();
      /**
       * support ref
       */
      const el3 = (tableAction as any as ComponentPublicInstance)?.$el;
      /**
       * try guess el1、el2、el3 not empty
       */
      return el1 ?? el2 ?? el3 ?? null;
    } catch (error) {
      return null;
    }
  }

  useEventListener(
    computed(tryGetTableWrapperElement),
    triggerToEventNameMap[trigger],
    trackRowInfo,
    { capture: true },
  );

  function extend(data: Partial<Row>) {
    extendInfo.value = data as any;
  }

  const returned: UseTrackTableRowReturn = {
    row: computed(() => {
      const rawRow = toRaw(unref(row));
      if (!rawRow) return null;
      const rawExtendInfo = toRaw(unref(extendInfo)) as Partial<Row>;
      return { ...rawRow, ...rawExtendInfo };
    }) as ComputedRef<Row | null>,
    extend,
  };

  if (provide) {
    createTrackTableRowContext(returned);
  }

  return returned;
}

const useTrackTableRowInjectionKey = Symbol(
  'track-table-row',
) as InjectionKey<UseTrackTableRowReturn>;

function createTrackTableRowContext(context: UseTrackTableRowReturn) {
  return provide(useTrackTableRowInjectionKey, context);
}

export function useTrackTableRowContext<Row extends Record<string, any>>() {
  return inject(useTrackTableRowInjectionKey, {
    row: computed(() => null),
    extend: noop,
  }) as UseTrackTableRowReturn<Row>;
}
