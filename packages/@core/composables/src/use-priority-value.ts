import type { ComputedRef, Ref } from 'vue';

import { computed, getCurrentInstance, unref, useAttrs, useSlots } from 'vue';

import {
  getFirstNonNullOrUndefined,
  kebabToCamelCase,
} from '@vben-core/shared/utils';

/**
 * 依次从插槽、attrs、props、state 中获取值
 *
 * 已知限制:对运行时声明且带非 undefined 默认值的 Boolean prop,Vue 会把
 * "未传"与"显式 false"解析为同一个值(false),不产生任何 reactive 触发,
 * 因此"仅存在性变化"(false → false)无法使本 computed 重新求值。需要
 * presence 敏感的 Boolean prop 应以 default: undefined 声明(禁用 boolean
 * cast),或不在 withDefaults 中提供默认值而把默认值交给 state。
 *
 * @param key
 * @param props
 * @param state
 */
export function usePriorityValue<
  T extends Record<string, any>,
  S extends Record<string, any>,
  K extends keyof T = keyof T,
>(key: K, props: T, state: Readonly<Ref<NoInfer<S>>> | undefined) {
  const instance = getCurrentInstance();
  const slots = useSlots();
  const attrs = useAttrs() as T;

  const value = computed((): T[K] => {
    // props不管有没有传，都会有默认值，会影响这里的顺序，
    // 通过判断原始props是否有值来判断是否传入
    const rawProps = (instance?.vnode?.props || {}) as T;

    const standardRawProps = {} as T;

    for (const [key, value] of Object.entries(rawProps)) {
      standardRawProps[kebabToCamelCase(key) as K] = value;
    }

    // 总是读取 props[key] 以建立响应式依赖：否则初始未传入的 prop
    // （原始值为 undefined）在后续被传入时，computed 不会重新求值
    const propsValue = props[key];
    const propsKey =
      standardRawProps?.[key] === undefined ? undefined : propsValue;

    // slot可以关闭
    return getFirstNonNullOrUndefined(
      slots[key as string],
      attrs[key],
      propsKey,
      state?.value?.[key as keyof S],
    ) as T[K];
  });

  return value;
}

/**
 * 批量获取state中的值（每个值都是ref）
 * @param props
 * @param state
 */
export function usePriorityValues<
  T extends Record<string, any>,
  // S 是已发布的公共 API 契约：调用方以 usePriorityValues<Props, StateRef>(…)
  // 显式传参指定 state 的 Ref 类型；默认值依赖 T 推断（NoInfer<T>），
  // 规则只看签名内出现次数、不评估跨包调用方，不能据此删除。
  // oxlint-disable-next-line typescript/no-unnecessary-type-parameters
  S extends Ref<Record<string, any>> = Readonly<Ref<NoInfer<T>, NoInfer<T>>>,
>(props: T, state: S | undefined) {
  const result: { [K in keyof T]: ComputedRef<T[K]> } = {} as never;

  (Object.keys(props) as (keyof T)[]).forEach((key) => {
    result[key] = usePriorityValue(key, props, state);
  });

  return result;
}

/**
 * 批量获取state中的值（集中在一个computed，用于透传）
 * @param props
 * @param state
 */
export function useForwardPriorityValues<
  T extends Record<string, any>,
  // 同 usePriorityValues：两个类型实参的调用形态是已发布契约，保留 S。
  // oxlint-disable-next-line typescript/no-unnecessary-type-parameters
  S extends Ref<Record<string, any>> = Readonly<Ref<NoInfer<T>, NoInfer<T>>>,
>(props: T, state: S | undefined) {
  const computedResult: { [K in keyof T]: ComputedRef<T[K]> } = {} as never;

  (Object.keys(props) as (keyof T)[]).forEach((key) => {
    computedResult[key] = usePriorityValue(key, props, state);
  });

  return computed(() => {
    const unwrapResult: Record<string, any> = {};
    Object.keys(props).forEach((key) => {
      unwrapResult[key] = unref(computedResult[key]);
    });
    return unwrapResult as { [K in keyof T]: T[K] };
  });
}
