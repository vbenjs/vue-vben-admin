import type { IContextMenuItem } from '@vben-core/tabs-ui';
import type { TabItem } from '@vben-core/typings';
import type {
  RouteLocationNormalized,
  RouteRecordNormalized,
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
import { storeToRefs, useAccessStore, useTabbarStore } from '@vben-core/stores';
import { filterTree } from '@vben-core/toolkit';

function useTabs() {
  const router = useRouter();
  const route = useRoute();
  const accessStore = useAccessStore();
  const tabsStore = useTabbarStore();
  const { accessMenus } = storeToRefs(accessStore);

  const currentActive = computed(() => {
    return route.path;
  });

  const { locale } = useI18n();
  const currentTabs =
    ref<(RouteLocationNormalized | RouteRecordNormalized)[]>();
  watch([() => tabsStore.getTabs, () => locale.value], ([tabs, _]) => {
    currentTabs.value = tabs.map((item) => wrapperTabLocale(item));
  });

  /**
   * 初始化固定标签页
   */
  const initAffixTabs = () => {
    const affixTabs = filterTree(router.getRoutes(), (route) => {
      return !!route.meta?.affixTab;
    });
    tabsStore.setAffixTabs(affixTabs);
  };

  // 点击tab,跳转路由
  const handleClick = (key: string) => {
    router.push(key);
  };

  // 关闭tab
  const handleClose = async (key: string) => {
    await tabsStore.closeTabByKey(key, router);
  };

  function wrapperTabLocale(
    tab: RouteLocationNormalized | RouteRecordNormalized,
  ) {
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
      tabsStore.addTab(route as RouteLocationNormalized);
    },
    { immediate: true },
  );

  const createContextMenus = (tab: TabItem) => {
    const tabs = tabsStore.getTabs;
    const affixTabs = tabsStore.affixTabs;
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
          await tabsStore.refreshTab(router);
        },
        icon: IcRoundRefresh,
        key: 'reload',
        text: '重新加载',
      },
      {
        disabled: !!affixTab || disabled,
        handler: async () => {
          await tabsStore.closeTab(tab, router);
        },
        icon: IcRoundClose,
        key: 'close',
        text: '关闭标签页',
      },
      {
        handler: async () => {
          await (affixTab
            ? tabsStore.unPushPinTab(tab)
            : tabsStore.pushPinTab(tab));
        },
        icon: affixTab ? MdiPinOff : MdiPin,
        key: 'affix',
        separator: true,
        text: affixTab ? '取消固定标签页' : '固定标签页',
      },
      {
        disabled: closeLeftDisabled,
        handler: async () => {
          await tabsStore.closeLeftTabs(tab);
        },
        icon: MdiFormatHorizontalAlignLeft,
        key: 'close-left',
        text: '关闭左侧标签页',
      },
      {
        disabled: closeRightDisabled,
        handler: async () => {
          await tabsStore.closeRightTabs(tab);
        },
        icon: MdiFormatHorizontalAlignRight,
        key: 'close-right',
        separator: true,
        text: '关闭右侧标签页',
      },
      {
        disabled: closeOtherDisabled,
        handler: async () => {
          await tabsStore.closeOtherTabs(tab);
        },
        icon: MdiArrowExpandHorizontal,
        key: 'close-other',
        text: '关闭其他标签页',
      },
      {
        disabled,
        handler: async () => {
          await tabsStore.closeAllTabs(router);
        },
        icon: IcRoundMultipleStop,
        key: 'close-all',
        text: '关闭全部标签页',
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
    await tabsStore.unPushPinTab(tab);
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
