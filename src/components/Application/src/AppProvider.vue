<script lang="ts">
  import { defineComponent, toRefs, ref } from 'vue';

  import { createAppProviderContext } from './useAppContext';

  import designSetting from '/@/settings/designSetting';
  import { createBreakpointListen } from '/@/hooks/event/useBreakpoint';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'AppProvider',
    inheritAttrs: false,
    props: {
      prefixCls: propTypes.string.def(designSetting.prefixCls),
    },
    setup(props, { slots }) {
      const isMobileRef = ref(false);

      createBreakpointListen(({ screenMap, sizeEnum, width }) => {
        const lgWidth = screenMap.get(sizeEnum.LG);
        if (lgWidth) {
          isMobileRef.value = width.value - 1 < lgWidth;
        }
      });

      const { prefixCls } = toRefs(props);
      createAppProviderContext({ prefixCls, isMobile: isMobileRef });

      return () => slots.default?.();
    },
  });
</script>
