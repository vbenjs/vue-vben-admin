import {
  watch,
  computed,
  WatchSource,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  nextTick,
  reactive,
  ComponentInternalInstance,
} from 'vue';
import { error } from '../log';

export function explicitComputed<T, S>(source: WatchSource<S>, fn: () => T) {
  const v = reactive<any>({ value: fn() });
  watch(source, () => (v.value = fn()));
  return computed<T>(() => v.value);
}

export function tryOnMounted(fn: () => void, sync = true) {
  if (getCurrentInstance()) {
    onMounted(fn);
  } else if (sync) {
    fn();
  } else {
    nextTick(fn);
  }
}

export function tryOnUnmounted(fn: () => Promise<void> | void) {
  getCurrentInstance() && onUnmounted(fn);
}

export function tryTsxEmit<T extends any = ComponentInternalInstance>(
  fn: (_instance: T) => Promise<void> | void
) {
  const instance = getCurrentInstance() as any;
  instance && fn.call(null, instance);
}

export function isInSetup() {
  if (!getCurrentInstance()) {
    error('Please put useForm function in the setup function!');
  }
}
