// collapse 展开折叠
import { defineComponent } from 'vue';
import { getSlot } from '/@/utils/helper/tsxHelper';
// import { createJavascriptTransition } from './CreateTransition';
import ExpandTransition from './ExpandTransition.vue';

// export const ExpandTransition = createJavascriptTransition(
//   'expand-transition',
//   ExpandTransitionGenerator()
// );
export default defineComponent({
  name: 'CollapseTransition',
  setup(_, { slots }) {
    return () => <ExpandTransition>{() => getSlot(slots)}</ExpandTransition>;
  },
});
