import './index.less';

import type { MenuState } from './types';
import type { Menu as MenuType } from '/@/router/types';

import {
  computed,
  defineComponent,
  unref,
  reactive,
  watch,
  toRefs,
  ComputedRef,
  ref,
  CSSProperties,
} from 'vue';
import { Menu } from 'ant-design-vue';
import MenuContent from './MenuContent';
// import { ScrollContainer } from '/@/components/Container';
// import { BasicArrow } from '/@/components/Basic';

import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';
import { ThemeEnum } from '/@/enums/appEnum';

import { appStore } from '/@/store/modules/app';

import { useOpenKeys } from './useOpenKeys';
import { useRouter } from 'vue-router';

import { isFunction } from '/@/utils/is';
import { getSlot } from '/@/utils/helper/tsxHelper';
import { menuHasChildren } from './helper';
import { getCurrentParentPath } from '/@/router/menus';

import { basicProps } from './props';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { REDIRECT_NAME } from '/@/router/constant';
import { tabStore } from '/@/store/modules/tab';
import { useDesign } from '/@/hooks/web/useDesign';
export default defineComponent({
  name: 'BasicMenu',
  props: basicProps,
  emits: ['menuClick'],
  setup(props, { slots, emit }) {
    const currentParentPath = ref('');
    const isClickGo = ref(false);

    const menuState = reactive<MenuState>({
      defaultSelectedKeys: [],
      mode: props.mode,
      theme: computed(() => props.theme) as ComputedRef<ThemeEnum>,
      openKeys: [],
      selectedKeys: [],
      collapsedOpenKeys: [],
    });

    const { prefixCls } = useDesign('basic-menu');

    const { items, mode, accordion } = toRefs(props);

    const { getCollapsed, getIsHorizontal, getTopMenuAlign, getSplit } = useMenuSetting();

    const { currentRoute } = useRouter();

    const { handleOpenChange, setOpenKeys, getOpenKeys } = useOpenKeys(
      menuState,
      items,
      mode,
      accordion
    );

    const getMenuClass = computed(() => {
      const { type } = props;
      const { mode } = menuState;
      return [
        prefixCls,
        `justify-${unref(getTopMenuAlign)}`,
        {
          [`${prefixCls}--hide-title`]: !unref(showTitle),
          [`${prefixCls}--collapsed-show-title`]: props.collapsedShowTitle,
          [`${prefixCls}__second`]:
            !props.isHorizontal && appStore.getProjectConfig.menuSetting.split,
          [`${prefixCls}__sidebar-hor`]:
            type === MenuTypeEnum.TOP_MENU && mode === MenuModeEnum.HORIZONTAL,
        },
      ];
    });

    const showTitle = computed(() => props.collapsedShowTitle && unref(getCollapsed));

    const getInlineCollapseOptions = computed(() => {
      const isInline = props.mode === MenuModeEnum.INLINE;

      const inlineCollapseOptions: { inlineCollapsed?: boolean } = {};
      if (isInline) {
        inlineCollapseOptions.inlineCollapsed = unref(getCollapsed);
      }
      return inlineCollapseOptions;
    });

    const getWrapperStyle = computed(
      (): CSSProperties => {
        const isHorizontal = unref(getIsHorizontal);
        return {
          height: isHorizontal
            ? `calc(100% + 1px)`
            : `calc(100% - ${props.showLogo ? '48px' : '0px'})`,
          overflowY: isHorizontal ? 'hidden' : 'auto',
        };
      }
    );

    watch(
      () => tabStore.getCurrentTab,
      () => {
        if (unref(currentRoute).name === REDIRECT_NAME) return;
        handleMenuChange();
        unref(getSplit) && getParentPath();
      }
    );

    watch(
      () => props.items,
      () => {
        handleMenuChange();
      },
      {
        immediate: true,
      }
    );

    getParentPath();

    async function getParentPath() {
      const { appendClass } = props;
      if (!appendClass) return '';
      const parentPath = await getCurrentParentPath(unref(currentRoute).path);

      currentParentPath.value = parentPath;
    }

    async function handleMenuClick({ key, keyPath }: { key: string; keyPath: string[] }) {
      const { beforeClickFn } = props;
      if (beforeClickFn && isFunction(beforeClickFn)) {
        const flag = await beforeClickFn(key);
        if (!flag) return;
      }
      emit('menuClick', key);

      isClickGo.value = true;
      menuState.openKeys = keyPath;
      menuState.selectedKeys = [key];
    }

    function handleMenuChange() {
      if (unref(isClickGo)) {
        isClickGo.value = false;
        return;
      }
      const path = unref(currentRoute).path;
      if (menuState.mode !== MenuModeEnum.HORIZONTAL) {
        setOpenKeys(path);
      }
      menuState.selectedKeys = [path];
    }

    // function renderExpandIcon({ key }: { key: string }) {
    //   const isOpen = getOpenKeys.value.includes(key);
    //   const collapsed = unref(getCollapsed);
    //   return (
    //     <BasicArrow
    //       expand={isOpen}
    //       bottom
    //       inset
    //       class={[
    //         `${prefixCls}__expand-icon`,
    //         {
    //           [`${prefixCls}__expand-icon--collapsed`]: collapsed,
    //         },
    //       ]}
    //     />
    //   );
    // }

    function renderItem(menu: MenuType, level = 1) {
      return !menuHasChildren(menu) ? renderMenuItem(menu, level) : renderSubMenu(menu, level);
    }

    function renderMenuItem(menu: MenuType, level: number) {
      const { appendClass } = props;
      const isAppendActiveCls =
        appendClass && level === 1 && menu.path === unref(currentParentPath);
      const levelCls = [
        `${prefixCls}-item__level${level}`,
        ` ${menuState.theme} `,
        {
          'top-active-menu': isAppendActiveCls,
        },
      ];
      return (
        <Menu.Item key={menu.path} class={levelCls}>
          {() => [
            <MenuContent
              item={menu}
              showTitle={unref(showTitle)}
              isHorizontal={props.isHorizontal}
            />,
          ]}
        </Menu.Item>
      );
    }

    function renderSubMenu(menu: MenuType, level: number) {
      const levelCls = `${prefixCls}-item__level${level} ${menuState.theme} `;
      return (
        <Menu.SubMenu key={menu.path} class={levelCls}>
          {{
            title: () => [
              <MenuContent
                showTitle={unref(showTitle)}
                item={menu}
                isHorizontal={props.isHorizontal}
              />,
            ],
            // expandIcon: renderExpandIcon,
            default: () => (menu.children || []).map((item) => renderItem(item, level + 1)),
          }}
        </Menu.SubMenu>
      );
    }

    function renderMenu() {
      const { selectedKeys, defaultSelectedKeys, mode, theme } = menuState;

      return (
        <Menu
          selectedKeys={selectedKeys}
          defaultSelectedKeys={defaultSelectedKeys}
          mode={mode}
          openKeys={unref(getOpenKeys)}
          inlineIndent={props.inlineIndent}
          theme={unref(theme)}
          onOpenChange={handleOpenChange}
          class={unref(getMenuClass)}
          onClick={handleMenuClick}
          {...unref(getInlineCollapseOptions)}
        >
          {{
            default: () => unref(items).map((item) => renderItem(item)),
          }}
        </Menu>
      );
    }

    return () => {
      return (
        <>
          {!unref(getIsHorizontal) && getSlot(slots, 'header')}
          <div class={`${prefixCls}-wrapper`} style={unref(getWrapperStyle)}>
            {renderMenu()}
          </div>
        </>
      );
    };
  },
});
