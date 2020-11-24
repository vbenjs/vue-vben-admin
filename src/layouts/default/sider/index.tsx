import './index.less';

import { computed, defineComponent, ref, unref, watch, nextTick } from 'vue';

import { Layout } from 'ant-design-vue';
import LayoutMenu from '../menu';

import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useTrigger, useDragLine, useSiderEvent } from './useLayoutSider';
import { useLayoutContext } from '../useLayoutContext';

export default defineComponent({
  name: 'LayoutSideBar',
  setup() {
    const topRef = ref(0);
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
    } = useMenuSetting();

    const { getShowFullHeaderRef, getUnFixedAndFull } = useHeaderSetting();

    const injectValue = useLayoutContext();

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

    const showClassSideBarRef = computed(() => {
      return unref(getSplit) ? unref(getMenuHidden) : true;
    });

    const getSiderClass = computed(() => {
      return {
        'layout-sidebar': true,
        fixed: unref(getMenuFixed),
        hidden: !unref(showClassSideBarRef),
      };
    });

    const getSiderStyle = computed(() => {
      const top = `${unref(topRef)}px`;
      if (!unref(getMenuFixed)) {
        return { top };
      }
      return {
        top,
        height: `calc(100% - ${top})`,
      };
    });

    watch(
      () => getShowFullHeaderRef.value,
      () => {
        topRef.value = 0;
        if (unref(getUnFixedAndFull)) return;
        nextTick(() => {
          const fullHeaderEl = unref(injectValue.fullHeaderRef)?.$el;
          if (!fullHeaderEl) return;
          topRef.value = fullHeaderEl.offsetHeight;
        });
      },
      {
        immediate: true,
      }
    );

    const getHiddenDomStyle = computed(() => {
      const width = `${unref(getRealWidth)}px`;
      return {
        width: width,
        overflow: 'hidden',
        flex: `0 0 ${width}`,
        'max-width': width,
        'min-width': width,
        transition: 'all 0.2s',
      };
    });

    function renderDefault() {
      return (
        <>
          <LayoutMenu
            theme={unref(getMenuTheme)}
            menuMode={unref(getMode)}
            splitType={unref(getSplitType)}
          />
          {renderDragLine()}
        </>
      );
    }

    return () => {
      return (
        <>
          {unref(getMenuFixed) && (
            <div style={unref(getHiddenDomStyle)} class={{ hidden: !unref(showClassSideBarRef) }} />
          )}

          <Layout.Sider
            ref={sideRef}
            breakpoint="md"
            collapsible
            class={unref(getSiderClass)}
            style={unref(getSiderStyle)}
            width={unref(getMenuWidth)}
            collapsed={unref(getCollapsed)}
            collapsedWidth={unref(getCollapsedWidth)}
            theme={unref(getMenuTheme)}
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
        </>
      );
    };
  },
});
