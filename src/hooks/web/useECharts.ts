import type { EChartsOption } from 'echarts';
import { MaybeRef, ref, unref, watch, computed } from 'vue';
import { useElementSize, useDebounceFn } from '@vueuse/core';
import { useRootSetting } from '@/hooks/setting/useRootSetting';
import echarts from '@/utils/lib/echarts';

export function useECharts(
  target: MaybeRef<HTMLDivElement>,
  theme: 'light' | 'dark' | 'default' = 'default',
) {
  let instance: echarts.ECharts | null = null;
  const cacheOptions = ref({});
  const { width, height } = useElementSize(target);
  const echarsInstance = computed(() => instance);
  const { getDarkMode: getSysDarkMode } = useRootSetting();
  const getDarkMode = computed(() => (theme === 'default' ? getSysDarkMode.value : theme));
  const getOptions = computed(() => {
    if (getDarkMode.value !== 'dark') {
      return cacheOptions.value as EChartsOption;
    }
    return {
      backgroundColor: 'transparent',
      ...cacheOptions.value,
    } as EChartsOption;
  });

  const resizeFn = useDebounceFn(([{ width, height }]) => {
    instance?.resize({ width, height });
  }, 200);

  const remove = () => {
    if (instance) {
      instance.dispose();
      instance = null;
    }
  };

  const setOptions = (options: EChartsOption, clear = true) => {
    cacheOptions.value = options;
    if (!instance) return;
    clear && instance.clear();
    instance.setOption(getOptions.value);
  };

  const setOptionsFn = useDebounceFn(setOptions, 200);

  function resize() {
    instance?.resize({
      animation: { duration: 300, easing: 'quadraticIn' },
    });
  }

  watch([width, height], resizeFn);
  watch([() => unref(target), getDarkMode], ([el, theme]) => {
    if (!el) {
      remove();
      return;
    }
    instance?.dispose();
    instance = echarts.init(el, theme);
    setOptionsFn(cacheOptions.value);
  });

  return {
    setOptions,
    setOptionsFn,
    resize,
    resizeFn,
    echarts,
    echarsInstance,
  };
}
