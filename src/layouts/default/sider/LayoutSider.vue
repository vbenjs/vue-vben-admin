<template>
  <div
    v-if="getMenuFixed && !getIsMobile"
    :style="getHiddenDomStyle"
    :class="{ hidden: !showClassSideBarRef }"
  />
  <Sider
    ref="sideRef"
    breakpoint="lg"
    collapsible
    :class="getSiderClass"
    :width="getMenuWidth"
    :collapsed="getIsMobile ? false : getCollapsed"
    :collapsedWidth="getCollapsedWidth"
    :theme="getMenuTheme"
    @collapse="onCollapseChange"
    @breakpoint="onBreakpointChange"
    v-bind="getTriggerAttr"
  >
    <template #trigger v-if="getShowTrigger">
      <LayoutTrigger />
    </template>
    <LayoutMenu :theme="getMenuTheme" :menuMode="getMode" :splitType="getSplitType" />
    <DragBar ref="dragBarRef" />
  </Sider>
</template>
<script lang="ts">
  import { computed, defineComponent, ref, unref, CSSProperties } from 'vue';

  import { Layout } from 'ant-design-vue';
  import LayoutMenu from '../menu';
  import LayoutTrigger from '/@/layouts/default/trigger/index.vue';

  import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';

  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useTrigger, useDragLine, useSiderEvent } from './useLayoutSider';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useDesign } from '/@/hooks/web/useDesign';

  import DragBar from './DragBar.vue';
  export default defineComponent({
    name: 'LayoutSideBar',
    components: { Sider: Layout.Sider, LayoutMenu, DragBar, LayoutTrigger },
    setup() {
      const dragBarRef = ref<ElRef>(null);
      const sideRef = ref<ElRef>(null);

      const {
        getCollapsed,
        getMenuWidth,
        getSplit,
        getMenuTheme,
        getRealWidth,
        getMenuHidden,
        getMenuFixed,
        getIsMixMode,
      } = useMenuSetting();

      const { prefixCls } = useDesign('layout-sideBar');

      const { getIsMobile } = useAppInject();

      const { getTriggerAttr, getShowTrigger } = useTrigger(getIsMobile);

      useDragLine(sideRef, dragBarRef);

      const { getCollapsedWidth, onBreakpointChange, onCollapseChange } = useSiderEvent();

      const getMode = computed(() => {
        return unref(getSplit) ? MenuModeEnum.INLINE : null;
      });

      const getSplitType = computed(() => {
        return unref(getSplit) ? MenuSplitTyeEnum.LEFT : MenuSplitTyeEnum.NONE;
      });

      const showClassSideBarRef = computed(() => {
        return unref(getSplit) ? !unref(getMenuHidden) : true;
      });

      const getSiderClass = computed(() => {
        return [
          prefixCls,
          {
            [`${prefixCls}--fixed`]: unref(getMenuFixed),
            hidden: !unref(showClassSideBarRef),
            [`${prefixCls}--mix`]: unref(getIsMixMode) && !unref(getIsMobile),
          },
        ];
      });

      const getHiddenDomStyle = computed(
        (): CSSProperties => {
          const width = `${unref(getRealWidth)}px`;
          return {
            width: width,
            overflow: 'hidden',
            flex: `0 0 ${width}`,
            maxWidth: width,
            minWidth: width,
            transition: 'all 0.2s',
          };
        }
      );

      return {
        prefixCls,
        sideRef,
        dragBarRef,
        getIsMobile,
        getHiddenDomStyle,
        getSiderClass,
        getTriggerAttr,
        getCollapsedWidth,
        getMenuFixed,
        showClassSideBarRef,
        getMenuWidth,
        getCollapsed,
        getMenuTheme,
        onBreakpointChange,
        getMode,
        getSplitType,
        onCollapseChange,
        getShowTrigger,
      };
    },
  });
</script>
<style lang="less">
  @import './index.less';
</style>
