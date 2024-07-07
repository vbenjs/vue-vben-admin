import { h } from 'vue';

import { Icon } from '@iconify/vue';

function createIconifyIcon(icon: string) {
  return h(Icon, { icon });
}

export { createIconifyIcon };
