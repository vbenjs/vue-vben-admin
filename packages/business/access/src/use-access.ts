import { computed } from 'vue';

import { preferences } from '@vben-core/preferences';

function useAccess() {
  const accessMode = computed(() => {
    return preferences.app.accessMode;
  });

  return { accessMode };
}

export { useAccess };
