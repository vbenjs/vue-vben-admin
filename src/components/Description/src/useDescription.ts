import type { DescriptionProps, DescInstance, UseDescReturnType } from './typing';
import { ref, unref, onUnmounted, watch, WatchStopHandle } from 'vue';
import { isProdMode } from '/@/utils/env';
import { error } from '/@/utils/log';
import { getDynamicProps } from '/@/utils';

export function useDescription(props?: Partial<DescriptionProps>): UseDescReturnType {
  const descriptionRef = ref<Nullable<DescInstance>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);

  let stopWatch: WatchStopHandle;

  function getDescriptionInstance() {
    const description = unref(descriptionRef);
    if (!description) {
      error('useDescription() can only be used inside setup() or functional components!');
    }
    return description;
  }

  function register(instance: DescInstance) {
    isProdMode() &&
      onUnmounted(() => {
        descriptionRef.value = null;
      });
    if (unref(loadedRef) && isProdMode() && instance === unref(descriptionRef)) return;
    descriptionRef.value = instance;
    props && instance.setProps(props);
    loadedRef.value = true;

    stopWatch?.();

    stopWatch = watch(
      () => props,
      () => {
        props && instance.setProps(getDynamicProps(props));
      },
      {
        immediate: true,
        deep: true,
      },
    );
  }

  const methods: DescInstance = {
    setProps: (descProps: Partial<DescriptionProps>): void => {
      getDescriptionInstance()?.setProps(descProps);
    },
  };

  return [register, methods];
}
