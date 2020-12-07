import './index.less';

import { PropType, toRef } from 'vue';
import type { Menu } from '/@/router/types';

import { computed, defineComponent, unref } from 'vue';
import { BasicMenu } from '/@/components/Menu/index';
import { AppLogo } from '/@/components/Application';

import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';

import { useGo } from '/@/hooks/web/usePage';
import { useSplitMenu } from './useLayoutMenu';
import { openWindow } from '/@/utils';
import { propTypes } from '/@/utils/propTypes';

export default defineComponent({
  name: 'LayoutMenu',
  props: {
    theme: propTypes.oneOf(['light', 'dark']),

    splitType: {
      type: Number as PropType<MenuSplitTyeEnum>,
      default: MenuSplitTyeEnum.NONE,
    },

    isHorizontal: propTypes.bool,
    // menu Mode
    menuMode: {
      type: [String] as PropType<Nullable<MenuModeEnum>>,
      default: '',
    },
  },
  setup(props) {
    const go = useGo();

    const {
      setMenuSetting,
      getMenuMode,
      getMenuType,
      getCollapsedShowTitle,
      getIsSidebarType,
      getMenuTheme,
      getCollapsed,
      getAccordion,
    } = useMenuSetting();

    const { getShowLogo } = useRootSetting();

    const { flatMenusRef, menusRef } = useSplitMenu(toRef(props, 'splitType'));

    const showLogo = computed(() => unref(getShowLogo) && unref(getIsSidebarType));

    const getComputedMenuMode = computed(() => props.menuMode || unref(getMenuMode));

    const getComputedMenuTheme = computed(() => props.theme || unref(getMenuTheme));

    const appendClass = computed(() => props.splitType === MenuSplitTyeEnum.TOP);

    /**
     * click menu
     * @param menu
     */
    function handleMenuClick(menu: Menu) {
      go(menu.path);
    }

    /**
     * before click menu
     * @param menu
     */
    async function beforeMenuClickFn(menu: Menu) {
      const { meta: { externalLink } = {} } = menu;

      if (externalLink) {
        openWindow(externalLink);
        return false;
      }
      return true;
    }

    function handleClickSearchInput() {
      unref(getCollapsed) && setMenuSetting({ collapsed: false });
    }

    function renderHeader() {
      if (!unref(showLogo)) return null;
      return (
        <AppLogo
          showTitle={!unref(getCollapsed)}
          class={[`layout-menu__logo`, unref(getComputedMenuTheme)]}
          theme={unref(getComputedMenuTheme)}
        />
      );
    }

    return () => {
      return (
        <BasicMenu
          class="layout-menu"
          beforeClickFn={beforeMenuClickFn}
          isHorizontal={props.isHorizontal}
          appendClass={unref(appendClass)}
          type={unref(getMenuType)}
          mode={unref(getComputedMenuMode)}
          collapsedShowTitle={unref(getCollapsedShowTitle)}
          theme={unref(getComputedMenuTheme)}
          showLogo={unref(showLogo)}
          items={unref(menusRef)}
          flatItems={unref(flatMenusRef)}
          accordion={unref(getAccordion)}
          onMenuClick={handleMenuClick}
          onClickSearchInput={handleClickSearchInput}
        >
          {{
            header: () => renderHeader(),
          }}
        </BasicMenu>
      );
    };
  },
});
