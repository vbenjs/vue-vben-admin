<template>
  <slot />
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent, toRefs } from 'vue';

  import { createAppProviderContext } from './useAppContext';
  export default defineComponent({
    name: 'AppProvider',
    inheritAttrs: false,
    props: {
      prefixCls: {
        type: String as PropType<string>,
        default: 'vben',
      },
    },
    setup(props) {
      const { prefixCls } = toRefs(props);
      createAppProviderContext({ prefixCls });
      return {};
    },
  });
</script>
