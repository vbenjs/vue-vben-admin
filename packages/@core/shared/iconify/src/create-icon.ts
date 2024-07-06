import { h } from 'vue';

import { Icon } from '@iconify/vue';

function createIcon(icon: string) {
  return h(Icon, { icon });
}

export { createIcon };
