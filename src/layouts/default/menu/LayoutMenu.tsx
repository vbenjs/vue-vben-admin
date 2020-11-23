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

export default defineComponent({
  name: 'DefaultLayoutMenu',
  props: {
    theme: {
      type: String as PropType<string>,
      default: '',
    },
    splitType: {
      type: Number as PropType<MenuSplitTyeEnum>,
      default: MenuSplitTyeEnum.NONE,
    },
    parentMenuPath: {
      type: String as PropType<string>,
      default: '',
    },
    showSearch: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    isHorizontal: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    menuMode: {
      type: [String] as PropType<MenuModeEnum | null>,
      default: '',
    },
  },
  setup(props) {
    const go = useGo();

    const {
      setMenuSetting,
      getShowSearch,
      getMode,
      getType,
      getCollapsedShowTitle,
      getCollapsedShowSearch,
      getIsSidebarType,
      getTheme,
      getCollapsed,
      getAccordion,
    } = useMenuSetting();

    const { getShowLogo } = useRootSetting();

    const { flatMenusRef, menusRef } = useSplitMenu(toRef(props, 'splitType'));

    const showLogo = computed(() => unref(getShowLogo) && unref(getIsSidebarType));

    const getMenuMode = computed(() => props.menuMode || unref(getMode));

    const getMenuTheme = computed(() => props.theme || unref(getTheme));

    const appendClass = computed(() => props.splitType === MenuSplitTyeEnum.TOP);

    const showSearch = computed(() => {
      return (
        unref(getShowSearch) &&
        props.showSearch &&
        (unref(getCollapsedShowSearch) ? true : !unref(getCollapsed))
      );
    });

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
          class={[`layout-menu__logo`, unref(getMenuTheme)]}
          theme={unref(getMenuTheme)}
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
          type={unref(getType)}
          mode={unref(getMenuMode)}
          collapsedShowTitle={unref(getCollapsedShowTitle)}
          theme={unref(getMenuTheme)}
          showLogo={unref(showLogo)}
          search={unref(showSearch)}
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
