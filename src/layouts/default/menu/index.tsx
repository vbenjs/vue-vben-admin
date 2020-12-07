import './index.less';

import { PropType, toRef } from 'vue';

import { computed, defineComponent, unref } from 'vue';
import { BasicMenu } from '/@/components/Menu';
import { AppLogo } from '/@/components/Application';

import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

import { useGo } from '/@/hooks/web/usePage';
import { useSplitMenu } from './useLayoutMenu';
import { openWindow } from '/@/utils';
import { propTypes } from '/@/utils/propTypes';
import { isUrl } from '/@/utils/is';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';

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
      getMenuMode,
      getMenuType,
      getCollapsedShowTitle,
      getMenuTheme,
      getCollapsed,
      getAccordion,
      getIsSidebarType,
    } = useMenuSetting();
    const { getShowLogo } = useRootSetting();

    const { menusRef } = useSplitMenu(toRef(props, 'splitType'));

    const getComputedMenuMode = computed(() => props.menuMode || unref(getMenuMode));

    const getComputedMenuTheme = computed(() => props.theme || unref(getMenuTheme));
    const showLogo = computed(() => unref(getShowLogo) && unref(getIsSidebarType));
    const appendClass = computed(() => props.splitType === MenuSplitTyeEnum.TOP);
    /**
     * click menu
     * @param menu
     */
    function handleMenuClick(path: string) {
      go(path);
    }

    /**
     * before click menu
     * @param menu
     */
    async function beforeMenuClickFn(path: string) {
      if (!isUrl(path)) {
        return true;
      }
      openWindow(path);
      return false;
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
          beforeClickFn={beforeMenuClickFn}
          isHorizontal={props.isHorizontal}
          type={unref(getMenuType)}
          mode={unref(getComputedMenuMode)}
          collapsedShowTitle={unref(getCollapsedShowTitle)}
          theme={unref(getComputedMenuTheme)}
          items={unref(menusRef)}
          accordion={unref(getAccordion)}
          onMenuClick={handleMenuClick}
          appendClass={unref(appendClass)}
          showLogo={unref(showLogo)}
        >
          {{
            header: () => renderHeader(),
          }}
        </BasicMenu>
      );
    };
  },
});
