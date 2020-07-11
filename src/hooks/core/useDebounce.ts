import {
  DebounceAndThrottleOptions,
  DebounceAndThrottleProcedureResult,
  DebounceAndThrottleProcedure,
} from './types';
import { throttle, useThrottle } from './useThrottle';

/**
 * @description: 适用于组件内
 */
export function useDebounce<T extends unknown[]>(
  handle: DebounceAndThrottleProcedure<T>,
  wait: number,
  options: DebounceAndThrottleOptions = {}
): DebounceAndThrottleProcedureResult<T> {
  return useThrottle(
    handle,
    wait,
    Object.assign(options, {
      debounce: true,
    })
  );
}

/**
 * 防抖函数
 */
export function debounce<T extends unknown[]>(
  handle: DebounceAndThrottleProcedure<T>,
  wait: number,
  options: DebounceAndThrottleOptions = {}
): DebounceAndThrottleProcedureResult<T> {
  return throttle(
    handle,
    wait,
    Object.assign(options, {
      debounce: true,
    })
  );
}
