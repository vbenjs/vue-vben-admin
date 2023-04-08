<script lang="ts">
  import { GLOBAL_NAMESPACE } from '@vben/constants';
  import { defineComponent, ref, toRefs, unref } from 'vue';

  import { MenuModeEnum, MenuTypeEnum } from '@/enums/menuEnum';
  import { useAppStore } from '@/store/modules/app';

  import { createAppProviderContext } from './useAppContext';

  const props = {
    /**
     * class style prefix
     */
    prefixCls: { type: String, default: GLOBAL_NAMESPACE },
  };

  export default defineComponent({
    name: 'AppProvider',
    inheritAttrs: false,
    props,
    setup(props, { slots }) {
      const isMobile = ref(false);
      const isSetState = ref(false);

      const appStore = useAppStore();

      // TODO: 响应式
      handleRestoreState();

      const { prefixCls } = toRefs(props);

      // Inject variables into the global
      createAppProviderContext({ prefixCls, isMobile });

      /**
       * Used to maintain the state before the window changes
       */
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
            appStore.setProjectConfig({
              menuSetting: {
                type: MenuTypeEnum.SIDEBAR,
                mode: MenuModeEnum.INLINE,
                split: false,
              },
            });
            appStore.setBeforeMiniInfo({ menuMode, menuCollapsed, menuType, menuSplit });
          }
        } else {
          if (unref(isSetState)) {
            isSetState.value = false;
            const { menuMode, menuCollapsed, menuType, menuSplit } = appStore.getBeforeMiniInfo;
            appStore.setProjectConfig({
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
