import { WatchOptions } from 'vue';
import { watch } from 'vue';
import { isFunction } from '/@/utils/is';

export const useEffect = (effectHandler: Fn, dependencies: any[]) => {
  return watch(
    dependencies,
    (changedDependencies, prevDependencies, onCleanUp) => {
      const effectCleaner = effectHandler(changedDependencies, prevDependencies);
      if (isFunction(effectCleaner)) {
        onCleanUp(effectCleaner);
      }
    },
    { immediate: true, deep: true } as WatchOptions
  );
};
