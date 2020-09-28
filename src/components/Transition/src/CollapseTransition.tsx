import type { PropType } from 'vue';

// collapse 展开折叠
import { defineComponent } from 'vue';
import { getSlot } from '/@/utils/helper/tsxHelper';
import { createJavascriptTransition } from './CreateTransition';
import ExpandTransitionGenerator from './ExpandTransition';

export const ExpandTransition = createJavascriptTransition(
  'expand-transition',
  ExpandTransitionGenerator()
);
export default defineComponent({
  name: 'CollapseTransition',
  components: {
    ExpandTransition,
  },
  props: {
    // 是否打开折叠功能
    enable: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  setup(props, { slots }) {
    return () =>
      props.enable ? <ExpandTransition>{() => getSlot(slots)}</ExpandTransition> : getSlot(slots);
  },
});
