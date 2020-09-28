import type {
  DebounceAndThrottleOptions,
  DebounceAndThrottleProcedureResult,
  DebounceAndThrottleProcedure,
} from './types';
import {
  // throttle,
  useThrottle,
} from './useThrottle';

/**
 * @description: Applicable in components
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
