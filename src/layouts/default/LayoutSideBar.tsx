import { computed, defineComponent, nextTick, onMounted, ref, unref } from 'vue';

import { Layout } from 'ant-design-vue';
import LayoutTrigger from './LayoutTrigger';
import LayoutMenu from '/@/layouts/default/menu/LayoutMenu';

import { menuStore } from '/@/store/modules/menu';
import { appStore } from '/@/store/modules/app';

import { MenuModeEnum, MenuSplitTyeEnum, TriggerEnum } from '/@/enums/menuEnum';
import { SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from '/@/enums/appEnum';

import { useDebounce } from '/@/hooks/core/useDebounce';

export default defineComponent({
  name: 'DefaultLayoutSideBar',
  setup() {
    const initRef = ref(false);
    const brokenRef = ref(false);
    const collapseRef = ref(true);
    const dragBarRef = ref<Nullable<HTMLDivElement>>(null);
    const sideRef = ref<any>(null);

    const getProjectConfigRef = computed(() => {
      return appStore.getProjectConfig;
    });

    const getMiniWidth = computed(() => {
      const {
        menuSetting: { collapsedShowTitle },
      } = unref(getProjectConfigRef);
      return collapsedShowTitle ? SIDE_BAR_SHOW_TIT_MINI_WIDTH : SIDE_BAR_MINI_WIDTH;
    });

    function onCollapseChange(val: boolean) {
      if (initRef.value) {
        collapseRef.value = val;
        menuStore.commitCollapsedState(val);
      } else {
        const collapsed = appStore.getProjectConfig.menuSetting.collapsed;
        !collapsed && menuStore.commitCollapsedState(val);
      }
      initRef.value = true;
    }

    // Menu area drag and drop-mouse movement
    function handleMouseMove(ele: any, wrap: any, clientX: number) {
      document.onmousemove = function (innerE) {
        let iT = ele.left + ((innerE || event).clientX - clientX);
        innerE = innerE || window.event;
        // let tarnameb = innerE.target || innerE.srcElement;
        const maxT = 600;
        const minT = unref(getMiniWidth);
        iT < 0 && (iT = 0);
        iT > maxT && (iT = maxT);
        iT < minT && (iT = minT);
        ele.style.left = wrap.style.width = iT + 'px';
        return false;
      };
    }

    // 菜单区域拖拽 - 鼠标松开
    function removeMouseup(ele: any) {
      const wrap = unref(sideRef).$el;
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
        const width = parseInt(wrap.style.width);
        menuStore.commitDragStartState(false);
        if (!menuStore.getCollapsedState) {
          if (width > unref(getMiniWidth) + 20) {
            setMenuWidth(width);
          } else {
            menuStore.commitCollapsedState(true);
          }
        } else {
          if (width > unref(getMiniWidth)) {
            setMenuWidth(width);
            menuStore.commitCollapsedState(false);
          }
        }

        ele.releaseCapture && ele.releaseCapture();
      };
    }

    function setMenuWidth(width: number) {
      appStore.commitProjectConfigState({
        menuSetting: {
          menuWidth: width,
        },
      });
    }

    function changeWrapWidth() {
      const ele = unref(dragBarRef) as any;
      const side = unref(sideRef);

      const wrap = (side || {}).$el;
      ele &&
        (ele.onmousedown = (e: any) => {
          menuStore.commitDragStartState(true);
          wrap.style.transition = 'unset';
          const clientX = (e || event).clientX;
          ele.left = ele.offsetLeft;
          handleMouseMove(ele, wrap, clientX);
          removeMouseup(ele);
          ele.setCapture && ele.setCapture();
          return false;
        });
    }
    function handleBreakpoint(broken: boolean) {
      brokenRef.value = broken;
    }

    const getDragBarStyle = computed(() => {
      if (menuStore.getCollapsedState) {
        return { left: `${unref(getMiniWidth)}px` };
      }
      return {};
    });

    const getCollapsedWidth = computed(() => {
      return unref(brokenRef) ? 0 : unref(getMiniWidth);
    });

    const showTrigger = computed(() => {
      const {
        menuSetting: { trigger },
      } = unref(getProjectConfigRef);
      return trigger !== TriggerEnum.NONE && trigger === TriggerEnum.FOOTER;
    });

    onMounted(() => {
      nextTick(() => {
        const [exec] = useDebounce(changeWrapWidth, 20);
        exec();
      });
    });

    function handleSiderClick(e: ChangeEvent) {
      if (!e || !e.target || e.target.className !== 'basic-menu__content') return;

      const { collapsed, show } = appStore.getProjectConfig.menuSetting;
      if (!collapsed || !show) return;
      appStore.commitProjectConfigState({
        menuSetting: {
          collapsed: false,
        },
      });
    }

    function renderDragLine() {
      const { menuSetting: { hasDrag = true } = {} } = unref(getProjectConfigRef);
      return (
        <div
          class={[`layout-sidebar__dargbar`, !hasDrag ? 'hide' : '']}
          style={unref(getDragBarStyle)}
          ref={dragBarRef}
        />
      );
    }

    return () => {
      const {
        menuSetting: { theme, split: splitMenu },
      } = unref(getProjectConfigRef);
      const { getCollapsedState, getMenuWidthState } = menuStore;

      const triggerDom = unref(showTrigger)
        ? {
            trigger: () => <LayoutTrigger />,
          }
        : {};

      const triggerAttr = unref(showTrigger)
        ? {}
        : {
            trigger: null,
          };

      return (
        <Layout.Sider
          onClick={handleSiderClick}
          onCollapse={onCollapseChange}
          breakpoint="md"
          width={getMenuWidthState}
          collapsed={getCollapsedState}
          collapsible
          collapsedWidth={unref(getCollapsedWidth)}
          theme={theme}
          class="layout-sidebar"
          ref={sideRef}
          onBreakpoint={handleBreakpoint}
          {...triggerAttr}
        >
          {{
            ...triggerDom,
            default: () => (
              <>
                <LayoutMenu
                  theme={theme}
                  menuMode={splitMenu ? MenuModeEnum.INLINE : null}
                  splitType={splitMenu ? MenuSplitTyeEnum.LEFT : MenuSplitTyeEnum.NONE}
                />
                {renderDragLine()}
              </>
            ),
          }}
        </Layout.Sider>
      );
    };
  },
});
