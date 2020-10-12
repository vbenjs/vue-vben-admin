import type { PropType } from 'vue';
import type { Menu } from '/@/router/types';

import { computed, defineComponent, unref, ref, onMounted, watch } from 'vue';
import { BasicMenu } from '/@/components/Menu/index';
import Logo from '/@/layouts/Logo.vue';

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
import { useTabs } from '/@/hooks/web/useTabs';
import { PageEnum } from '/@/enums/pageEnum';

// import
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
    menuMode: {
      type: [String] as PropType<MenuModeEnum | null>,
      default: '',
    },
  },
  setup(props) {
    const menusRef = ref<Menu[]>([]);
    const flatMenusRef = ref<Menu[]>([]);
    const { currentRoute } = useRouter();
    const { addTab } = useTabs();

    const getProjectConfigRef = computed(() => {
      return appStore.getProjectConfig;
    });

    const getIsHorizontalRef = computed(() => {
      return unref(getProjectConfigRef).menuSetting.mode === MenuModeEnum.HORIZONTAL;
    });

    onMounted(() => {
      genMenus();
    });
    const [throttleHandleSplitLeftMenu] = useThrottle(handleSplitLeftMenu, 50);

    // watch(
    //   () => menuStore.getCurrentTopSplitMenuPathState,
    //   async (parentPath: string) => {
    //     throttleHandleSplitLeftMenu(parentPath);
    //   }
    // );
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
    watch(
      [() => permissionStore.getLastBuildMenuTimeState, permissionStore.getBackMenuListState],
      () => {
        genMenus();
      }
    );

    watch([() => appStore.getProjectConfig.menuSetting.split], () => {
      if (props.splitType !== MenuSplitTyeEnum.LEFT && !unref(getIsHorizontalRef)) return;
      genMenus();
    });

    async function handleSplitLeftMenu(parentPath: string) {
      const isSplitMenu = unref(getProjectConfigRef).menuSetting.split;
      if (!isSplitMenu) return;
      const { splitType } = props;
      // 菜单分割模式-left
      if (splitType === MenuSplitTyeEnum.LEFT) {
        const children = await getChildrenMenus(parentPath);
        if (!children) return;
        const flatChildren = await getFlatChildrenMenus(children);
        flatMenusRef.value = flatChildren;
        menusRef.value = children;
      }
    }

    async function genMenus() {
      const isSplitMenu = unref(getProjectConfigRef).menuSetting.split;

      // 普通模式

      const { splitType } = props;
      if (splitType === MenuSplitTyeEnum.NONE || !isSplitMenu) {
        flatMenusRef.value = await getFlatMenus();
        menusRef.value = await getMenus();
        return;
      }

      // 菜单分割模式-top
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
        const { splitType } = props;
        // 菜单分割模式-top
        if (splitType === MenuSplitTyeEnum.TOP) {
          menuStore.commitCurrentTopSplitMenuPathState(path);
        }
        addTab(path as PageEnum, true);
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

    return () => {
      const {
        showLogo,
        menuSetting: { type: menuType, mode, theme, collapsed },
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
          theme={themeData}
          showLogo={isShowLogo}
          search={unref(showSearchRef) && !collapsed}
          items={unref(menusRef)}
          flatItems={unref(flatMenusRef)}
          onClickSearchInput={handleClickSearchInput}
          appendClass={props.splitType === MenuSplitTyeEnum.TOP}
        >
          {{
            header: () =>
              isShowLogo && (
                <Logo
                  showTitle={!collapsed}
                  class={[`layout-menu__logo`, collapsed ? 'justify-center' : '', themeData]}
                />
              ),
          }}
        </BasicMenu>
      );
    };
  },
});
