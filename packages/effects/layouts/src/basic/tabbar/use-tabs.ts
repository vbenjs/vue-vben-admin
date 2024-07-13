import type { IContextMenuItem } from '@vben-core/tabs-ui';
import type { TabItem } from '@vben-core/typings';
import type {
  RouteLocationNormalized,
  RouteLocationNormalizedGeneric,
} from 'vue-router';

import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  IcRoundClose,
  IcRoundFitScreen,
  IcRoundMultipleStop,
  IcRoundRefresh,
  IcRoundTableView,
  IcTwotoneFitScreen,
  MdiArrowExpandHorizontal,
  MdiFormatHorizontalAlignLeft,
  MdiFormatHorizontalAlignRight,
  MdiPin,
  MdiPinOff,
} from '@vben-core/iconify';
import { $t, useI18n } from '@vben-core/locales';
import { updatePreferences, usePreferences } from '@vben-core/preferences';
import {
  storeToRefs,
  useCoreAccessStore,
  useCoreTabbarStore,
} from '@vben-core/stores';
import { filterTree, openWindow } from '@vben-core/toolkit';

function updateContentScreen(screen: boolean) {
  updatePreferences({
    header: {
      hidden: !!screen,
    },
    sidebar: {
      hidden: !!screen,
    },
  });
}

function useTabs() {
  const router = useRouter();
  const route = useRoute();
  const accessStore = useCoreAccessStore();
  const { contentIsMaximize } = usePreferences();
  const coreTabbarStore = useCoreTabbarStore();
  const { accessMenus } = storeToRefs(accessStore);

  const currentActive = computed(() => {
    return route.path;
  });

  const { locale } = useI18n();
  const currentTabs = ref<RouteLocationNormalizedGeneric[]>();
  watch([() => coreTabbarStore.getTabs, () => locale.value], ([tabs, _]) => {
    currentTabs.value = tabs.map((item) => wrapperTabLocale(item));
  });

  /**
   * 初始化固定标签页
   */
  const initAffixTabs = () => {
    const affixTabs = filterTree(router.getRoutes(), (route) => {
      return !!route.meta?.affixTab;
    });
    coreTabbarStore.setAffixTabs(affixTabs);
  };

  // 点击tab,跳转路由
  const handleClick = (key: string) => {
    router.push(key);
  };

  // 关闭tab
  const handleClose = async (key: string) => {
    await coreTabbarStore.closeTabByKey(key, router);
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
      coreTabbarStore.addTab(route as RouteLocationNormalized);
    },
    { immediate: true },
  );

  const createContextMenus = (tab: TabItem) => {
    const tabs = coreTabbarStore.getTabs;
    const affixTabs = coreTabbarStore.affixTabs;
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
        handler: async () => {
          if (!contentIsMaximize.value) {
            await router.push(tab.fullPath);
          }
          updateContentScreen(!contentIsMaximize.value);
        },
        icon: contentIsMaximize.value ? IcRoundFitScreen : IcTwotoneFitScreen,
        key: contentIsMaximize.value ? 'restore-maximize' : 'maximize',
        text: contentIsMaximize.value
          ? $t('preferences.tabbar.contextMenu.restoreMaximize')
          : $t('preferences.tabbar.contextMenu.maximize'),
      },
      {
        disabled: !isCurrentTab,
        handler: async () => {
          await coreTabbarStore.refresh(router);
        },
        icon: IcRoundRefresh,
        key: 'reload',
        text: $t('preferences.tabbar.contextMenu.reload'),
      },
      {
        disabled: !!affixTab || disabled,
        handler: async () => {
          await coreTabbarStore.closeTab(tab, router);
        },
        icon: IcRoundClose,
        key: 'close',
        text: $t('preferences.tabbar.contextMenu.close'),
      },
      {
        handler: async () => {
          await (affixTab
            ? coreTabbarStore.unpinTab(tab)
            : coreTabbarStore.pinTab(tab));
        },
        icon: affixTab ? MdiPinOff : MdiPin,
        key: 'affix',
        text: affixTab
          ? $t('preferences.tabbar.contextMenu.unpin')
          : $t('preferences.tabbar.contextMenu.pin'),
      },
      {
        handler: async () => {
          const { hash, origin } = location;
          const path = tab.fullPath;
          const fullPath = path.startsWith('/') ? path : `/${path}`;
          const url = `${origin}${hash ? '/#' : ''}${fullPath}`;
          openWindow(url, { target: '_blank' });
        },
        icon: IcRoundTableView,
        key: 'open-in-new-window',
        separator: true,
        text: $t('preferences.tabbar.contextMenu.openInNewWindow'),
      },

      {
        disabled: closeLeftDisabled,
        handler: async () => {
          await coreTabbarStore.closeLeftTabs(tab);
        },
        icon: MdiFormatHorizontalAlignLeft,
        key: 'close-left',
        text: $t('preferences.tabbar.contextMenu.closeLeft'),
      },
      {
        disabled: closeRightDisabled,
        handler: async () => {
          await coreTabbarStore.closeRightTabs(tab);
        },
        icon: MdiFormatHorizontalAlignRight,
        key: 'close-right',
        separator: true,
        text: $t('preferences.tabbar.contextMenu.closeRight'),
      },
      {
        disabled: closeOtherDisabled,
        handler: async () => {
          await coreTabbarStore.closeOtherTabs(tab);
        },
        icon: MdiArrowExpandHorizontal,
        key: 'close-other',
        text: $t('preferences.tabbar.contextMenu.closeOther'),
      },
      {
        disabled,
        handler: async () => {
          await coreTabbarStore.closeAllTabs(router);
        },
        icon: IcRoundMultipleStop,
        key: 'close-all',
        text: $t('preferences.tabbar.contextMenu.closeAll'),
      },
    ];
    return menus;
  };

  /**
   * 取消固定标签页
   */
  const handleUnpinTab = async (tab: TabItem) => {
    await coreTabbarStore.unpinTab(tab);
  };

  return {
    createContextMenus,
    currentActive,
    currentTabs,
    handleClick,
    handleClose,
    handleUnpinTab,
  };
}

export { updateContentScreen, useTabs };
