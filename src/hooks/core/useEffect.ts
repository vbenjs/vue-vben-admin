import { watch } from 'vue';
import { isFunction } from '/@/utils/is';

export function useEffect<T extends any = any>(
  effectHandler: (deps: T[], prevDeps?: T[]) => () => void,
  dependencies: T[]
) {
  return watch(
    dependencies,
    (changedDependencies, prevDependencies, onCleanUp) => {
      const effectCleaner = effectHandler(changedDependencies, prevDependencies);
      if (isFunction(effectCleaner)) {
        onCleanUp(effectCleaner);
      }
    },
    { immediate: true, deep: true }
  );
}
