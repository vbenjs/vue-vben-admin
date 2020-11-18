import type { MenuState } from './types';
import type { Menu as MenuType } from '/@/router/types';

import { computed, defineComponent, unref, reactive, watch, onMounted, ref, toRefs } from 'vue';
import { Menu } from 'ant-design-vue';
import SearchInput from './SearchInput.vue';
import MenuContent from './MenuContent';

import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';
import { ThemeEnum } from '/@/enums/appEnum';

import { menuStore } from '/@/store/modules/menu';
import { appStore } from '/@/store/modules/app';

import { useSearchInput } from './useSearchInput';
import { useOpenKeys } from './useOpenKeys';
import { useRouter } from 'vue-router';

import { isFunction } from '/@/utils/is';
import { getSlot } from '/@/utils/helper/tsxHelper';
import { menuHasChildren } from './helper';

import { getCurrentParentPath } from '/@/router/menus';

import { basicProps } from './props';
import './index.less';
export default defineComponent({
  name: 'BasicMenu',
  props: basicProps,
  emits: ['menuClick'],
  setup(props, { slots, emit }) {
    const currentParentPath = ref('');
    const menuState = reactive<MenuState>({
      defaultSelectedKeys: [],
      mode: props.mode,
      theme: computed(() => props.theme),
      openKeys: [],
      searchValue: '',
      selectedKeys: [],
      collapsedOpenKeys: [],
    });
    const { currentRoute } = useRouter();

    const { items, flatItems, isAppMenu, mode, accordion } = toRefs(props);

    const { handleInputChange, handleInputClick } = useSearchInput({
      flatMenusRef: flatItems,
      emit: emit,
      menuState,
      handleMenuChange,
    });

    const { handleOpenChange, resetKeys, setOpenKeys } = useOpenKeys(
      menuState,
      items,
      flatItems,
      isAppMenu,
      mode,
      accordion
    );

    const getOpenKeys = computed(() => {
      if (props.isAppMenu) {
        return menuStore.getCollapsedState ? menuState.collapsedOpenKeys : menuState.openKeys;
      }
      return menuState.openKeys;
    });

    // menu外层样式
    const getMenuWrapStyle = computed((): any => {
      const { showLogo, search } = props;
      let offset = 0;
      if (search) {
        offset += 54;
      }
      if (showLogo) {
        offset += 46;
      }
      return {
        height: `calc(100% - ${offset - 12}px)`,
        position: 'relative',
        overflowY: 'auto',
      };
    });

    // 是否透明化左侧一级菜单
    const transparentMenuClass = computed(() => {
      const { type } = props;
      const { mode } = menuState;
      const cls: string[] = [];
      if (
        (type === MenuTypeEnum.TOP_MENU && mode === MenuModeEnum.HORIZONTAL) ||
        props.appendClass
      ) {
        cls.push('basic-menu__sidebar-hor');
      }

      if (!props.isTop && props.isAppMenu && appStore.getProjectConfig.menuSetting.split) {
        cls.push('basic-menu__second');
      }
      return cls;
    });

    const showTitle = computed(() => props.collapsedShowTitle && menuStore.getCollapsedState);

    watch(
      () => currentRoute.value.name,
      (name: string) => {
        if (name === 'Redirect') return;
        handleMenuChange();
        props.isTop && appStore.getProjectConfig.menuSetting.split && getParentPath();
      }
    );

    watch(
      () => props.items,
      () => {
        if (props.items) {
          handleMenuChange();
        }
      },
      {
        immediate: true,
      }
    );

    async function getParentPath() {
      const { appendClass } = props;
      if (!appendClass) return '';
      const parentPath = await getCurrentParentPath(unref(currentRoute).path);
      currentParentPath.value = parentPath;
    }

    async function handleMenuClick(menu: MenuType) {
      const { beforeClickFn } = props;
      if (beforeClickFn && isFunction(beforeClickFn)) {
        const flag = await beforeClickFn(menu);
        if (!flag) return;
      }
      emit('menuClick', menu);
      const { path } = menu;
      menuState.selectedKeys = [path];
    }

    function handleMenuChange() {
      const { flatItems } = props;
      if (!unref(flatItems) || flatItems.length === 0) return;
      const findMenu = flatItems.find((menu) => menu.path === unref(currentRoute).path);
      if (findMenu) {
        if (menuState.mode !== MenuModeEnum.HORIZONTAL) {
          setOpenKeys(findMenu);
        }
        menuState.selectedKeys = [findMenu.path];
      } else {
        resetKeys();
      }
    }

    // render menu item
    function renderMenuItem(menuList?: MenuType[], index = 1) {
      if (!menuList) return;
      const { appendClass } = props;
      const levelCls = `basic-menu-item__level${index} ${menuState.theme} `;
      return menuList.map((menu) => {
        if (!menu) {
          return null;
        }

        const isAppendActiveCls =
          appendClass && index === 1 && menu.path === unref(currentParentPath);
        // 没有子节点
        if (!menuHasChildren(menu)) {
          return (
            <Menu.Item
              key={menu.path}
              class={`${levelCls}${isAppendActiveCls ? ' top-active-menu ' : ''}`}
              onClick={handleMenuClick.bind(null, menu)}
            >
              {() => [
                <MenuContent
                  item={menu}
                  level={index}
                  isTop={props.isTop}
                  showTitle={unref(showTitle)}
                  searchValue={menuState.searchValue}
                />,
              ]}
            </Menu.Item>
          );
        }
        return (
          <Menu.SubMenu key={menu.path} class={levelCls}>
            {{
              title: () => [
                <MenuContent
                  showTitle={unref(showTitle)}
                  item={menu}
                  level={index}
                  isTop={props.isTop}
                  searchValue={menuState.searchValue}
                />,
              ],
              default: () => renderMenuItem(menu.children, index + 1),
            }}
          </Menu.SubMenu>
        );
      });
    }

    function renderMenu() {
      const isInline = props.mode === MenuModeEnum.INLINE;
      const { selectedKeys, defaultSelectedKeys, mode, theme } = menuState;

      const inlineCollapsedObj = isInline
        ? props.isAppMenu
          ? {
              inlineCollapsed: menuStore.getCollapsedState,
            }
          : { inlineCollapsed: props.inlineCollapsed }
        : {};
      return (
        <Menu
          selectedKeys={selectedKeys}
          defaultSelectedKeys={defaultSelectedKeys}
          mode={mode}
          openKeys={unref(getOpenKeys)}
          inlineIndent={props.inlineIndent}
          theme={unref(theme)}
          onOpenChange={handleOpenChange}
          class={[
            'basic-menu',
            props.collapsedShowTitle && 'collapsed-show-title',
            ...unref(transparentMenuClass),
          ]}
          {...inlineCollapsedObj}
        >
          {{
            default: () => renderMenuItem(props.items, 1),
          }}
        </Menu>
      );
    }

    onMounted(async () => {
      getParentPath();
    });

    return () => {
      const { getCollapsedState } = menuStore;
      const { mode } = props;
      return mode === MenuModeEnum.HORIZONTAL ? (
        renderMenu()
      ) : (
        <section class={[`basic-menu-wrap`, !unref(showTitle) && 'hide-title']}>
          {getSlot(slots, 'header')}
          <SearchInput
            class={!props.search ? 'hidden' : ''}
            theme={props.theme as ThemeEnum}
            onChange={handleInputChange}
            onClick={handleInputClick}
            collapsed={getCollapsedState}
          />
          <section style={unref(getMenuWrapStyle)} class="basic-menu__content">
            {renderMenu()}
          </section>
        </section>
      );
    };
  },
});
