import { Icon } from '@iconify/vue';
import { defineComponent, h } from 'vue';

function createIcon(name: string) {
  return defineComponent({
    setup(props, { attrs }) {
      return () => h(Icon, { icon: name, ...props, ...attrs });
    },
  });
}

export { createIcon };
