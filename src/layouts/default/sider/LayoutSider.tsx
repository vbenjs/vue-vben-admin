import './index.less';

import { computed, defineComponent, ref, unref, CSSProperties } from 'vue';

import { Layout } from 'ant-design-vue';
import LayoutMenu from '../menu';

import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useTrigger, useDragLine, useSiderEvent } from './useLayoutSider';
import { useAppInject } from '/@/hooks/web/useAppInject';
import { useDesign } from '/@/hooks/web/useDesign';

import DragBar from './DragBar.vue';
export default defineComponent({
  name: 'LayoutSideBar',
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

    const { getTriggerAttr, getTriggerSlot } = useTrigger(getIsMobile);

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

    function renderDefault() {
      return (
        <>
          <LayoutMenu
            theme={unref(getMenuTheme)}
            menuMode={unref(getMode)}
            splitType={unref(getSplitType)}
          />
          <DragBar ref={dragBarRef} />
        </>
      );
    }

    return () => {
      return (
        <>
          {unref(getMenuFixed) && !unref(getIsMobile) && (
            <div style={unref(getHiddenDomStyle)} class={{ hidden: !unref(showClassSideBarRef) }} />
          )}
          <Layout.Sider
            ref={sideRef}
            breakpoint="lg"
            collapsible
            class={unref(getSiderClass)}
            width={unref(getMenuWidth)}
            collapsed={unref(getIsMobile) ? false : unref(getCollapsed)}
            collapsedWidth={unref(getCollapsedWidth)}
            theme={unref(getMenuTheme)}
            onCollapse={onCollapseChange}
            onBreakpoint={onBreakpointChange}
            {...unref(getTriggerAttr)}
          >
            {{
              ...unref(getTriggerSlot),
              default: () => renderDefault(),
            }}
          </Layout.Sider>
        </>
      );
    };
  },
});
