import { VbenIcon } from '@vben/icons';
import { isString } from '@vben/shared';
import type { VNode } from 'vue';
import { h } from 'vue';

export const TreeIcon = ({ icon }: { icon: VNode | string }) => {
  if (!icon) return null;
  if (isString(icon)) {
    return h(VbenIcon, { icon, class: 'mr-1' });
  }
  return VbenIcon;
};
