<script lang="ts">
  import { defineComponent, toRefs, ref, unref } from 'vue';

  import { createAppProviderContext } from './useAppContext';

  import designSetting from '/@/settings/designSetting';
  import { createBreakpointListen } from '/@/hooks/event/useBreakpoint';
  import { propTypes } from '/@/utils/propTypes';
  import { appStore } from '/@/store/modules/app';
  import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';

  export default defineComponent({
    name: 'AppProvider',
    inheritAttrs: false,
    props: {
      prefixCls: propTypes.string.def(designSetting.prefixCls),
    },
    setup(props, { slots }) {
      const isMobile = ref(false);
      const isSetState = ref(false);

      createBreakpointListen(({ screenMap, sizeEnum, width }) => {
        const lgWidth = screenMap.get(sizeEnum.LG);
        if (lgWidth) {
          isMobile.value = width.value - 1 < lgWidth;
        }
        handleRestoreState();
      });

      const { prefixCls } = toRefs(props);
      createAppProviderContext({ prefixCls, isMobile });

      function handleRestoreState() {
        if (unref(isMobile)) {
          if (!unref(isSetState)) {
            isSetState.value = true;
            const {
              menuSetting: {
                type: menuType,
                mode: menuMode,
                collapsed: menuCollapsed,
                split: menuSplit,
              },
            } = appStore.getProjectConfig;
            appStore.commitProjectConfigState({
              menuSetting: {
                type: MenuTypeEnum.SIDEBAR,
                mode: MenuModeEnum.INLINE,
                split: false,
              },
            });
            appStore.commitBeforeMiniState({ menuMode, menuCollapsed, menuType, menuSplit });
          }
        } else {
          if (unref(isSetState)) {
            isSetState.value = false;
            const { menuMode, menuCollapsed, menuType, menuSplit } = appStore.getBeforeMiniState;
            appStore.commitProjectConfigState({
              menuSetting: {
                type: menuType,
                mode: menuMode,
                collapsed: menuCollapsed,
                split: menuSplit,
              },
            });
          }
        }
      }
      return () => slots.default?.();
    },
  });
</script>
