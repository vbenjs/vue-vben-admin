import type { Ref } from 'vue';

import { ref, watch } from 'vue';
import { tryOnUnmounted } from '/@/utils/helper/vueHelper';
import { isString } from '/@/utils/is';

export function useTitle(overrideTitle: string | null = null): Ref<string | null> {
  const title = ref<string | null>(isString(overrideTitle) ? overrideTitle : document.title);
  const observer = new MutationObserver((m) => {
    title.value = m[0].target.textContent;
  });

  watch(
    title,
    (t, o) => {
      if (isString(t) && t !== o) {
        document.title = t;
      }
    },
    {
      immediate: true,
      flush: 'sync',
    }
  );

  const titleElement = document.querySelector('title')!;
  observer.observe(titleElement, { childList: true });
  tryOnUnmounted(() => {
    observer.disconnect();
  });
  return title;
}
