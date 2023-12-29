import type { VNode } from 'vue';
import { h } from 'vue';
import { isString } from 'lodash-es';
import Icon from '@/components/Icon/Icon.vue';

export const TreeIcon = ({ icon }: { icon: VNode | string | undefined }) => {
  if (!icon) return null;
  if (isString(icon)) {
    return h(Icon, { icon, class: 'mr-2' });
  }
  return h(Icon);
};
