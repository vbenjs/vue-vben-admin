<template>
  <slot></slot>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent, toRefs, ref } from 'vue';

  import { createAppProviderContext } from './useAppContext';

  import designSetting from '/@/settings/designSetting';
  import { createBreakpointListen } from '/@/hooks/event/useBreakpoint';

  export default defineComponent({
    name: 'AppProvider',
    inheritAttrs: false,
    props: {
      prefixCls: {
        type: String as PropType<string>,
        default: designSetting.prefixCls,
      },
    },
    setup(props) {
      const isMobileRef = ref(false);

      createBreakpointListen(({ screenMap, sizeEnum, width }) => {
        const lgWidth = screenMap.get(sizeEnum.LG);
        if (lgWidth) {
          isMobileRef.value = width.value - 1 < lgWidth;
        }
      });

      const { prefixCls } = toRefs(props);
      createAppProviderContext({ prefixCls, isMobile: isMobileRef });
      return {};
    },
  });
</script>
