<script lang="ts">
import type { PropType } from 'vue';

import type { DescriptionsItemSpan, DescriptionsRenderNode } from './types';

import { defineComponent } from 'vue';

import { DESCRIPTIONS_ITEM_NAME } from './use-descriptions';

/**
 * 子节点用法的标记组件，本身不渲染任何内容。
 * 其 props 与默认插槽会被父级 VbenDescriptions 收集为列表项。
 */
const VbenDescriptionsItem = defineComponent({
  name: DESCRIPTIONS_ITEM_NAME,
  props: {
    content: {
      default: undefined,
      type: [
        String,
        Number,
        Function,
        Object,
      ] as PropType<DescriptionsRenderNode>,
    },
    contentStyle: {
      default: undefined,
      type: Object,
    },
    label: {
      default: undefined,
      type: [
        String,
        Number,
        Function,
        Object,
      ] as PropType<DescriptionsRenderNode>,
    },
    labelStyle: {
      default: undefined,
      type: Object,
    },
    span: {
      default: undefined,
      type: [Number, String, Object] as PropType<DescriptionsItemSpan>,
    },
  },
  setup() {
    return () => null;
  },
});

// 额外标记，便于在 vnode 中稳健识别
(VbenDescriptionsItem as Record<string, any>).__isDescriptionsItem = true;

export default VbenDescriptionsItem;
</script>
