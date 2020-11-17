import type { PropType } from 'vue';
import type { Menu } from '/@/router/types';

import { computed, defineComponent, unref, ref, onMounted, watch } from 'vue';
import { BasicMenu } from '/@/components/Menu/index';
import Logo from '/@/layouts/logo/index.vue';

import { MenuModeEnum, MenuSplitTyeEnum, MenuTypeEnum } from '/@/enums/menuEnum';

// store
import { appStore } from '/@/store/modules/app';
import { menuStore } from '/@/store/modules/menu';

import {
  getMenus,
  getFlatMenus,
  getShallowMenus,
  getChildrenMenus,
  getFlatChildrenMenus,
  getCurrentParentPath,
} from '/@/router/menus/index';
import { useRouter } from 'vue-router';
import { useThrottle } from '/@/hooks/core/useThrottle';
import { permissionStore } from '/@/store/modules/permission';

import './index.less';
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
    isTop: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    menuMode: {
      type: [String] as PropType<MenuModeEnum | null>,
      default: '',
    },
  },
  setup(props) {
    // Menu array
    const menusRef = ref<Menu[]>([]);
    // flat menu array
    const flatMenusRef = ref<Menu[]>([]);
    const { currentRoute, push } = useRouter();

    // get app config
    const getProjectConfigRef = computed(() => {
      return appStore.getProjectConfig;
    });

    // get is Horizontal
    const getIsHorizontalRef = computed(() => {
      return unref(getProjectConfigRef).menuSetting.mode === MenuModeEnum.HORIZONTAL;
    });

    const [throttleHandleSplitLeftMenu] = useThrottle(handleSplitLeftMenu, 50);

    // Route change split menu
    watch(
      [() => unref(currentRoute).path, () => props.splitType],
      async ([path, splitType]: [string, MenuSplitTyeEnum]) => {
        if (splitType !== MenuSplitTyeEnum.LEFT && !unref(getIsHorizontalRef)) return;
        const parentPath = await getCurrentParentPath(path);
        parentPath && throttleHandleSplitLeftMenu(parentPath);
      },
      {
        immediate: true,
      }
    );

    // Menu changes
    watch(
      [() => permissionStore.getLastBuildMenuTimeState, () => permissionStore.getBackMenuListState],
      () => {
        genMenus();
      }
    );

    // split Menu changes
    watch([() => appStore.getProjectConfig.menuSetting.split], () => {
      if (props.splitType !== MenuSplitTyeEnum.LEFT && !unref(getIsHorizontalRef)) return;
      genMenus();
    });

    // Handle left menu split
    async function handleSplitLeftMenu(parentPath: string) {
      const isSplitMenu = unref(getProjectConfigRef).menuSetting.split;
      if (!isSplitMenu) return;
      const { splitType } = props;
      // spilt mode left
      if (splitType === MenuSplitTyeEnum.LEFT) {
        const children = await getChildrenMenus(parentPath);
        if (!children) {
          appStore.commitProjectConfigState({
            menuSetting: {
              hidden: false,
            },
          });
          flatMenusRef.value = [];
          menusRef.value = [];
          return;
        }
        const flatChildren = await getFlatChildrenMenus(children);
        appStore.commitProjectConfigState({
          menuSetting: {
            hidden: true,
          },
        });
        flatMenusRef.value = flatChildren;
        menusRef.value = children;
      }
    }

    // get menus
    async function genMenus() {
      const isSplitMenu = unref(getProjectConfigRef).menuSetting.split;

      // normal mode
      const { splitType } = props;
      if (splitType === MenuSplitTyeEnum.NONE || !isSplitMenu) {
        flatMenusRef.value = await getFlatMenus();
        menusRef.value = await getMenus();
        return;
      }

      // split-top
      if (splitType === MenuSplitTyeEnum.TOP) {
        const parentPath = await getCurrentParentPath(unref(currentRoute).path);
        menuStore.commitCurrentTopSplitMenuPathState(parentPath);
        const shallowMenus = await getShallowMenus();

        flatMenusRef.value = shallowMenus;
        menusRef.value = shallowMenus;
        return;
      }
    }

    function handleMenuClick(menu: Menu) {
      const { path } = menu;
      if (path) {
        push(path);
        const { splitType } = props;
        // split mode top
        if (splitType === MenuSplitTyeEnum.TOP) {
          menuStore.commitCurrentTopSplitMenuPathState(path);
        }
      }
    }

    async function beforeMenuClickFn(menu: Menu) {
      const { meta: { externalLink } = {} } = menu;

      if (externalLink) {
        window.open(externalLink, '_blank');
        return false;
      }

      return true;
    }

    function handleClickSearchInput() {
      if (menuStore.getCollapsedState) {
        menuStore.commitCollapsedState(false);
      }
    }

    const showSearchRef = computed(() => {
      const { showSearch, type, mode } = unref(getProjectConfigRef).menuSetting;
      return (
        showSearch &&
        props.showSearch &&
        !(type === MenuTypeEnum.MIX && mode === MenuModeEnum.HORIZONTAL)
      );
    });

    onMounted(() => {
      genMenus();
    });

    return () => {
      const {
        showLogo,
        menuSetting: {
          type: menuType,
          mode,
          theme,
          collapsed,
          collapsedShowTitle,
          collapsedShowSearch,
          accordion,
        },
      } = unref(getProjectConfigRef);

      const isSidebarType = menuType === MenuTypeEnum.SIDEBAR;
      const isShowLogo = showLogo && isSidebarType;
      const themeData = props.theme || theme;
      return (
        <BasicMenu
          beforeClickFn={beforeMenuClickFn}
          onMenuClick={handleMenuClick}
          type={menuType}
          mode={props.menuMode || mode}
          class="layout-menu"
          collapsedShowTitle={collapsedShowTitle}
          theme={themeData}
          showLogo={isShowLogo}
          search={unref(showSearchRef) && (collapsedShowSearch ? true : !collapsed)}
          items={unref(menusRef)}
          flatItems={unref(flatMenusRef)}
          onClickSearchInput={handleClickSearchInput}
          appendClass={props.splitType === MenuSplitTyeEnum.TOP}
          isTop={props.isTop}
          accordion={accordion}
        >
          {{
            header: () =>
              isShowLogo && (
                <Logo
                  showTitle={!collapsed}
                  class={[`layout-menu__logo`, themeData]}
                  theme={themeData}
                />
              ),
          }}
        </BasicMenu>
      );
    };
  },
});
