<script lang="tsx">
  import { defineComponent, computed, ref, unref, onMounted, nextTick } from '@/setup/vue';
  import LayoutMenu from './LayoutMenu.vue';

  import { Layout } from 'ant-design-vue';
  import SideBarTrigger from './SideBarTrigger.vue';

  // hooks
  import { useDesign } from '@/hooks/core/useDesign';
  import { useDebounce } from '@/hooks/core/useDebounce';

  // utils

  // store
  import { menuStore } from '@/store/modules/menu';
  import { appStore } from '@/store/modules/app';

  import { MenuThemeEnum } from '@/enums/menuEnum';

  import darkMiniIMg from '@/assets/images/sidebar/dark-mini.png';
  import lightMiniImg from '@/assets/images/sidebar/light-mini.png';
  import darkImg from '@/assets/images/sidebar/dark.png';
  import lightImg from '@/assets/images/sidebar/light.png';
  export default defineComponent({
    name: 'DefaultLayoutSideBar',
    setup() {
      const collapseRef = ref(true);
      const dragBarRef = ref<any>(null);
      const sideRef = ref<any>(null);

      const { prefixCls } = useDesign('layout-sidebar');

      // 根据展开状态设置背景图片

      const getStyle = computed(() => {
        const collapse = unref(collapseRef);

        const theme = appStore.getProjCfg.menuSetting.theme;
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
        collapseRef.value = val;
        menuStore.commitCollapsedState(val);
      }
      // 菜单区域拖拽 - 鼠标移动
      function handleMouseMove(ele, wrap, clientX) {
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
      function removeMoseup(ele) {
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
        appStore.commitProjCfgState({
          menuSetting: {
            ...appStore.getProjCfg.menuSetting,
            menuWidth: width,
          },
        });
      }
      function changeWrapWidth() {
        const ele = unref(dragBarRef);
        const wrap = unref(sideRef).$el;
        // const eleWidth = 6;
        ele &&
          (ele.onmousedown = (e) => {
            menuStore.commitDragStartState(true);
            wrap.style.transition = 'unset';
            const clientX = (e || event).clientX;
            ele.left = ele.offsetLeft;
            handleMouseMove(ele, wrap, clientX);
            removeMoseup(ele);
            ele.setCapture && ele.setCapture();
            return false;
          });
      }
      onMounted(() => {
        nextTick(() => {
          const [exec] = useDebounce(changeWrapWidth, 10);
          exec();
        });
      });
      const getDragBarStyle = computed(() => {
        if (menuStore.getCollapsedState) {
          return { left: '80px' };
        }
        return {};
      });
      return () => {
        const { getCollapsedState, getMenuWidthState } = menuStore;
        const { getProjCfg } = appStore;
        const { menuSetting: { theme, hasDrag } = {} } = getProjCfg;
        return (
          <Layout.Sider
            collapsible
            collapsed={getCollapsedState}
            onCollapse={onCollapseChange}
            width={getMenuWidthState}
            theme={theme}
            class={prefixCls}
            style={unref(getStyle)}
            ref={sideRef}
          >
            <SideBarTrigger slot="trigger" />
            <LayoutMenu theme={theme} />
            <div
              class={[`${prefixCls}__dargbar`, !hasDrag ? 'hide' : '']}
              style={unref(getDragBarStyle)}
              ref={dragBarRef}
            />
          </Layout.Sider>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-layout-sidebar';

  .@{prefix-cls} {
    background-size: 100% 100%;

    &__dargbar {
      position: absolute;
      top: 0;
      right: -2px;
      z-index: 200;
      width: 2px;
      height: 100%;
      cursor: col-resize;
      border-top: none;
      border-bottom: none;

      &.hide {
        display: none;
      }

      &:hover {
        background: @primary-color;
        box-shadow: 0 0 4px 0 rgba(28, 36, 56, 0.15);
      }
    }
  }
</style>
