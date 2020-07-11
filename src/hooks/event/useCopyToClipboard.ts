import { ref, watch } from 'compatible-vue';
import { copyTextToClipboard } from '@/common/plugins/copy';

import { isDef } from '@/utils/is/index';

export function useCopyToClipboard(initial?: string) {
  const clipboardRef = ref(initial || '');
  const isSuccessRef = ref(false);
  const copiedRef = ref(false);

  watch(
    clipboardRef,
    (str?: string) => {
      if (isDef(str)) {
        copiedRef.value = true;
        isSuccessRef.value = copyTextToClipboard(str);
      }
    },
    { immediate: !!initial, flush: 'sync' }
  );

  return { clipboardRef, isSuccessRef, copiedRef };
}
