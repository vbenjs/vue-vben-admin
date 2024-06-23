import { defineComponent, h } from 'vue';

import { Icon } from '@iconify/vue';

function createIcon(name: string) {
  return defineComponent({
    name: `SvgIcon-${name}`,
    setup(props, { attrs }) {
      return () => h(Icon, { icon: name, ...props, ...attrs });
    },
  });
}

export { createIcon };
