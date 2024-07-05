import type { IContextMenuItem } from '@vben-core/tabs-ui';
import type { TabItem } from '@vben-core/typings';
import type {
  RouteLocationNormalized,
  RouteLocationNormalizedGeneric,
} from 'vue-router';

import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { $t, useI18n } from '@vben/locales';
import {
  IcRoundClose,
  IcRoundMultipleStop,
  IcRoundRefresh,
  MdiArrowExpandHorizontal,
  MdiFormatHorizontalAlignLeft,
  MdiFormatHorizontalAlignRight,
  MdiPin,
  MdiPinOff,
} from '@vben-core/iconify';
import {
  storeToRefs,
  useCoreAccessStore,
  useCoreTabbarStore,
} from '@vben-core/stores';
import { filterTree } from '@vben-core/toolkit';

function useTabs() {
  const router = useRouter();
  const route = useRoute();
  const accessStore = useCoreAccessStore();
  const tabbarStore = useCoreTabbarStore();
  const { accessMenus } = storeToRefs(accessStore);

  const currentActive = computed(() => {
    return route.path;
  });

  const { locale } = useI18n();
  const currentTabs = ref<RouteLocationNormalizedGeneric[]>();
  watch([() => tabbarStore.getTabs, () => locale.value], ([tabs, _]) => {
    currentTabs.value = tabs.map((item) => wrapperTabLocale(item));
  });

  /**
   * 初始化固定标签页
   */
  const initAffixTabs = () => {
    const affixTabs = filterTree(router.getRoutes(), (route) => {
      return !!route.meta?.affixTab;
    });
    tabbarStore.setAffixTabs(affixTabs);
  };

  // 点击tab,跳转路由
  const handleClick = (key: string) => {
    router.push(key);
  };

  // 关闭tab
  const handleClose = async (key: string) => {
    await tabbarStore.closeTabByKey(key, router);
  };

  function wrapperTabLocale(tab: RouteLocationNormalizedGeneric) {
    return {
      ...tab,
      meta: {
        ...tab.meta,
        title: $t(tab.meta.title as string),
      },
    };
  }

  watch(
    () => accessMenus.value,
    () => {
      initAffixTabs();
    },
    { immediate: true },
  );

  watch(
    () => route.path,
    () => {
      tabbarStore.addTab(route as RouteLocationNormalized);
    },
    { immediate: true },
  );

  const createContextMenus = (tab: TabItem) => {
    const tabs = tabbarStore.getTabs;
    const affixTabs = tabbarStore.affixTabs;
    const index = tabs.findIndex((item) => item.path === tab.path);

    const disabled = tabs.length <= 1;

    const { meta } = tab;
    const affixTab = meta?.affixTab ?? false;
    const isCurrentTab = route.path === tab.path;

    // 当前处于最左侧或者减去固定标签页的数量等于0
    const closeLeftDisabled =
      index === 0 || index - affixTabs.length <= 0 || !isCurrentTab;

    const closeRightDisabled = !isCurrentTab || index === tabs.length - 1;

    const closeOtherDisabled =
      disabled || !isCurrentTab || tabs.length - affixTabs.length <= 1;

    const menus: IContextMenuItem[] = [
      {
        disabled: !isCurrentTab,
        handler: async () => {
          await tabbarStore.refresh(router);
        },
        icon: IcRoundRefresh,
        key: 'reload',
        text: $t('preferences.tabbar.context-menu.reload'),
      },
      {
        disabled: !!affixTab || disabled,
        handler: async () => {
          await tabbarStore.closeTab(tab, router);
        },
        icon: IcRoundClose,
        key: 'close',
        text: $t('preferences.tabbar.context-menu.close'),
      },
      {
        handler: async () => {
          await (affixTab
            ? tabbarStore.unPushPinTab(tab)
            : tabbarStore.pushPinTab(tab));
        },
        icon: affixTab ? MdiPinOff : MdiPin,
        key: 'affix',
        separator: true,
        text: affixTab
          ? $t('preferences.tabbar.context-menu.unpin')
          : $t('preferences.tabbar.context-menu.pin'),
      },
      {
        disabled: closeLeftDisabled,
        handler: async () => {
          await tabbarStore.closeLeftTabs(tab);
        },
        icon: MdiFormatHorizontalAlignLeft,
        key: 'close-left',
        text: $t('preferences.tabbar.context-menu.close-left'),
      },
      {
        disabled: closeRightDisabled,
        handler: async () => {
          await tabbarStore.closeRightTabs(tab);
        },
        icon: MdiFormatHorizontalAlignRight,
        key: 'close-right',
        separator: true,
        text: $t('preferences.tabbar.context-menu.close-right'),
      },
      {
        disabled: closeOtherDisabled,
        handler: async () => {
          await tabbarStore.closeOtherTabs(tab);
        },
        icon: MdiArrowExpandHorizontal,
        key: 'close-other',
        text: $t('preferences.tabbar.context-menu.close-other'),
      },
      {
        disabled,
        handler: async () => {
          await tabbarStore.closeAllTabs(router);
        },
        icon: IcRoundMultipleStop,
        key: 'close-all',
        text: $t('preferences.tabbar.context-menu.close-all'),
      },
      // {
      //   icon: 'icon-[material-symbols--back-to-tab-sharp]',
      //   key: 'close-all',
      //   text: '新窗口打开',
      // },
    ];
    return menus;
  };

  /**
   * 取消固定标签页
   */
  const handleUnPushPin = async (tab: TabItem) => {
    await tabbarStore.unPushPinTab(tab);
  };

  return {
    createContextMenus,
    currentActive,
    currentTabs,
    handleClick,
    handleClose,
    handleUnPushPin,
  };
}

export { useTabs };
