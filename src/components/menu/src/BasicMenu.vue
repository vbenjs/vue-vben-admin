<script lang="tsx">
  // components
  import { Menu } from 'ant-design-vue';
  import { Icon } from '@/components/icon/index';
  import SearchInput from './SearchInput.vue';
  import { ScrollContainer, TypeEnum } from '@/components/container/index';
  import { intersection } from '@/utils/lodashChunk';
  import {
    defineComponent,
    reactive,
    computed,
    watch,
    Ref,
    unref,
    PropOptions,
    ref,
  } from 'compatible-vue';

  // import projectSetting from '@/settings/projectSetting';

  // utils
  // import { flatTreeData } from '@/utils/helper/treeHelper';

  // import { es6Unique } from '@/utils/array/unique';

  // enums
  import { MenuTypeEnum, MenuThemeEnum, MenuModeEnum } from '@/enums/menuEnum';
  import { pageEnum } from '@/enums/pageEnum';
  import { RoleEnum } from '@/enums/roleEnum';
  import { AuthModeEnum } from '@/enums/appEnum';

  // types
  import { MenuState, MenuProps, MenuItem, MenuData } from './types';
  // import { MenuItem } from '@/router/menus/_type';

  // hook
  import { useDesign } from '@/hooks/core/useDesign';
  import { useSearchInput, useOpenKeys, useSideBar, menuHasChildren } from './useMenu';
  import { useRouter } from '@/hooks/core/useRouter';

  // store
  import { menuStore } from '@/store/modules/menu';
  import { appStore } from '@/store/modules/app';

  import { getSlot } from '@/utils/helper/tsxHelper';
  import { permissionStore } from '@/store/modules/permission';

  export default defineComponent({
    name: 'BasicMenu',
    props: {
      lastBuildTime: {
        type: Number,
        default: 0,
      } as PropOptions<number>,
      // 是否显示搜索框
      search: {
        type: Boolean,
        default: true,
      } as PropOptions<boolean>,
      // 生成菜单的方法
      buildMenuFn: {
        type: Function,
        defualt: null,
      } as PropOptions<any>,
      // 菜单组件的mode属性
      mode: {
        type: String,
        default: MenuModeEnum.INLINE,
      } as PropOptions<string>,
      type: {
        type: String,
        default: MenuTypeEnum.MIX,
      } as PropOptions<string>,
      theme: {
        type: String,
        default: MenuThemeEnum.DARK,
      } as PropOptions<string>,
      showLogo: {
        type: Boolean,
        default: false,
      } as PropOptions<boolean>,
      // 是否开启手风琴模式
      // accordion: {
      //   type: Boolean,
      //   default: true,
      // },
    },
    setup(props: MenuProps, { emit, slots }) {
      const { router } = useRouter();
      const menuState = reactive<MenuState>({
        defaultSelectedKeys: [],
        mode: props.mode,
        theme: computed(() => props.theme),
        inlineIndent: 30,
        openKeys: [],
        searchValue: '',
        selectedKeys: [],
        collapsedOpenKeys: [],
      });

      const allMenuRef = ref<MenuItem[]>([]);
      const loadingRef = ref(false);

      // computed

      const { prefixCls } = useDesign('menu');

      // 是否透明化左侧一级菜单
      const transparentMenuClass = computed(() => {
        const { type } = props;
        const { mode } = menuState;
        if (
          [MenuTypeEnum.MIX, MenuTypeEnum.SIDEBAR].includes(type) &&
          mode !== MenuModeEnum.HORIZONTAL
        ) {
          return `${prefixCls}-bg__sidebar`;
        }
        if (type === MenuTypeEnum.TOP_MENU && mode === MenuModeEnum.HORIZONTAL) {
          return `${prefixCls}-bg__sidebar-hor`;
        }
        return '';
      });

      // menu外层样式
      const getMenuWrapStyle = computed(() => {
        const { showLogo, search } = props;
        let offset = 0;
        if (search) {
          offset += 60;
        }
        if (showLogo) {
          offset += 54;
        }
        return {
          height: `calc(100% - ${offset}px)`,
          position: 'relative',
        };
      });

      const { buildMenuFn } = props;
      if (!buildMenuFn) {
        throw new Error('[BasicMenu]: buildMenuFn is not defined!');
      }

      // 获取菜单Readonly<Ref<Readonly<MenuData>>>
      const getAllMenu: Ref<MenuData> = computed(() => {
        return (unref(allMenuRef) as unknown) as MenuData;
      });

      // hook
      const { handleInputChange, handleInputClick, getIsShowSearch } = useSearchInput({
        menuState,
        getAllMenu,
        props,
      });

      const { getOpenKeys, handleOpenChange, setOpenKeys, resetKeys } = useOpenKeys(
        menuState,
        getAllMenu
      );

      // 菜单点击
      function handleMenuClick(menu: MenuItem): void {
        const { id, path } = menu;

        const allRoutes = permissionStore.getFlatRoutes;
        const targetRoute = allRoutes.find((item) => item.path === path);
        if (!targetRoute) {
          router.push(pageEnum.ERROR_PAGE);
          return;
        }
        const { meta: { externalLink } = {} } = targetRoute;

        if (externalLink) {
          window.open(externalLink, '_blank');
          return;
        }
        menuState.selectedKeys = [id];
        setOpenKeys(menu);
        emit('menuClick', {
          menu,
          targetRoute,
        });
      }

      /**
       * @description: 渲染图标
       */
      function renderIcon(icon: string) {
        return icon ? <Icon type={icon} /> : null;
      }
      /**
       * @description:  渲染内容
       */
      function renderItemContent(menu: Pick<MenuItem, 'name' | 'icon'>) {
        const { name, icon } = menu;
        const { searchValue } = menuState;
        const index = name.indexOf(searchValue);

        const beforeStr = name.substr(0, index);
        const afterStr = name.substr(index + searchValue.length);

        return [
          renderIcon(icon!),
          index > -1 && searchValue ? (
            <span>
              {beforeStr}
              <span class={`${prefixCls}__keyword`}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{name}</span>
          ),
        ];
      }

      /**
       * @description: 生成菜单
       */
      function renderMenuItem(menuList: MenuItem[], index = 1) {
        if (!menuList) {
          return;
        }
        // const { prefixCls } = useDesign('menu');
        return menuList.map((menu) => {
          if (!menu) {
            return null;
          }
          const { id, children, roles } = menu;
          const { authMode, headerSetting: { theme } = {} } = appStore.getProjCfg;
          const levelCls = `${prefixCls}-item__level${index} ${theme}`;
          if (roles && AuthModeEnum.ROLE === authMode) {
            const intersectionRole: RoleEnum[] = intersection(roles, permissionStore.getRoleState);
            if (intersectionRole.length === 0) {
              return null;
            }
          }

          // 没有子节点
          if (!menuHasChildren(menu)) {
            return (
              <Menu.Item key={id} class={[levelCls]} onClick={handleMenuClick.bind(null, menu)}>
                {renderItemContent(menu)}
              </Menu.Item>
            );
          }
          return (
            <Menu.SubMenu key={id} class={[levelCls]} popupClassName={`${prefixCls}__popup`}>
              <span slot="title">{renderItemContent(menu)}</span>
              {renderMenuItem(children!, index + 1)}
            </Menu.SubMenu>
          );
        });
      }

      watch(
        () => props.type,
        () => {
          // if ([MenuTypeEnum.TOP_MENU, MenuTypeEnum.MIX].includes(type)) {
          useSideBar({ menuState, getAllMenu, setOpenKeys, resetKeys });
          // }
        },
        {
          immediate: true,
        }
      );
      watch(
        () => props.lastBuildTime,
        async () => {
          try {
            loadingRef.value = true;
            const allMenus = await buildMenuFn();
            allMenuRef.value = unref(allMenus);
          } finally {
            loadingRef.value = false;
          }
        },
        {
          immediate: true,
        }
      );
      function renderMenu() {
        const isInline = props.mode === MenuModeEnum.INLINE;

        const inlineCollapsedObj = isInline
          ? {
              inlineCollapsed: menuStore.getCollapsedState,
            }
          : {};
        const { selectedKeys, defaultSelectedKeys, mode, theme } = menuState;
        const { allMenus } = unref(getAllMenu);

        return (
          <Menu
            selectedKeys={selectedKeys}
            defaultSelectedKeys={defaultSelectedKeys}
            mode={mode}
            theme={unref(theme)}
            openKeys={unref(getOpenKeys)}
            class={[prefixCls, unref(transparentMenuClass)]}
            onOpenChange={handleOpenChange}
            {...{
              props: {
                ...inlineCollapsedObj,
              },
            }}
          >
            {renderMenuItem(allMenus)}
          </Menu>
        );
      }

      return () => {
        const { getCollapsedState } = menuStore;
        return unref(loadingRef) ? null : props.mode === MenuModeEnum.HORIZONTAL ? (
          renderMenu()
        ) : (
          <section class={`${prefixCls}-wrap`}>
            {getSlot(slots, 'header')}
            {unref(getIsShowSearch) && (
              <SearchInput
                onChange={handleInputChange}
                onClick={handleInputClick}
                collapsed={getCollapsedState}
              />
            )}
            <section style={unref(getMenuWrapStyle)}>
              <ScrollContainer type={TypeEnum.DEFAULT}>{renderMenu()}</ScrollContainer>
            </section>
          </section>
        );
      };
    },
  });
</script>
<style lang="less">
  @import './basic-menu.less';
</style>
