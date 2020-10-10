import { computed, defineComponent, nextTick, onMounted, ref, unref } from 'vue';

import { Layout } from 'ant-design-vue';
import SideBarTrigger from './SideBarTrigger';
import { menuStore } from '/@/store/modules/menu';

import darkMiniIMg from '/@/assets/images/sidebar/dark-mini.png';
import lightMiniImg from '/@/assets/images/sidebar/light-mini.png';
import darkImg from '/@/assets/images/sidebar/dark.png';
import lightImg from '/@/assets/images/sidebar/light.png';
import { appStore } from '/@/store/modules/app';
import { MenuModeEnum, MenuSplitTyeEnum, MenuThemeEnum } from '/@/enums/menuEnum';
import { useDebounce } from '/@/hooks/core/useDebounce';
import LayoutMenu from './LayoutMenu';
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

    // 根据展开状态设置背景图片
    const getStyle = computed((): any => {
      const collapse = unref(collapseRef);

      const theme = unref(getProjectConfigRef).menuSetting.theme;
      let bg = '';
      if (theme === MenuThemeEnum.DARK) {
        bg = collapse ? darkMiniIMg : darkImg;
      }
      if (theme === MenuThemeEnum.LIGHT) {
        bg = collapse ? lightMiniImg : lightImg;
      }
      return {
        'background-image': `url(${bg})`,
      };
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

    // 菜单区域拖拽 - 鼠标移动
    function handleMouseMove(ele: any, wrap: any, clientX: number) {
      document.onmousemove = function (innerE) {
        let iT = ele.left + ((innerE || event).clientX - clientX);
        innerE = innerE || window.event;
        // let tarnameb = innerE.target || innerE.srcElement;
        const maxT = 600;
        const minT = 80;
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
          if (width > 100) {
            setMenuWidth(width);
          } else {
            menuStore.commitCollapsedState(true);
          }
        } else {
          if (width > 80) {
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
      // const eleWidth = 6;
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

    onMounted(() => {
      nextTick(() => {
        const [exec] = useDebounce(changeWrapWidth, 20);
        exec();
      });
    });

    const getDragBarStyle = computed(() => {
      if (menuStore.getCollapsedState) {
        return { left: '80px' };
      }
      return {};
    });

    const getCollapsedWidth = computed(() => {
      return unref(brokenRef) ? 0 : 80;
    });

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
      return (
        <Layout.Sider
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
          style={unref(getStyle)}
        >
          {{
            trigger: () => <SideBarTrigger />,
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
