import './index.less';

import { computed, defineComponent, ref, unref } from 'vue';

import { Layout } from 'ant-design-vue';
import LayoutMenu from '/@/layouts/default/menu/LayoutMenu';

import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useTrigger, useDragLine, useSiderEvent } from './useLayoutSider';

export default defineComponent({
  name: 'LayoutSideBar',
  setup() {
    const dragBarRef = ref<Nullable<HTMLDivElement>>(null);
    const sideRef = ref<Nullable<HTMLDivElement>>(null);

    const { getCollapsed, getMenuWidth, getSplit, getTheme } = useMenuSetting();

    const { getTriggerAttr, getTriggerSlot } = useTrigger();

    const { renderDragLine } = useDragLine(sideRef, dragBarRef);

    const {
      getCollapsedWidth,
      onBreakpointChange,
      onCollapseChange,
      onSiderClick,
    } = useSiderEvent();

    const getMode = computed(() => {
      return unref(getSplit) ? MenuModeEnum.INLINE : null;
    });

    const getSplitType = computed(() => {
      return unref(getSplit) ? MenuSplitTyeEnum.LEFT : MenuSplitTyeEnum.NONE;
    });

    function renderDefault() {
      return (
        <>
          <LayoutMenu
            theme={unref(getTheme)}
            menuMode={unref(getMode)}
            splitType={unref(getSplitType)}
          />
          {renderDragLine()}
        </>
      );
    }

    return () => {
      return (
        <Layout.Sider
          ref={sideRef}
          class="layout-sidebar"
          breakpoint="md"
          collapsible
          width={unref(getMenuWidth)}
          collapsed={unref(getCollapsed)}
          collapsedWidth={unref(getCollapsedWidth)}
          theme={unref(getTheme)}
          onClick={onSiderClick}
          onCollapse={onCollapseChange}
          onBreakpoint={onBreakpointChange}
          {...unref(getTriggerAttr)}
        >
          {{
            ...unref(getTriggerSlot),
            default: () => renderDefault(),
          }}
        </Layout.Sider>
      );
    };
  },
});
