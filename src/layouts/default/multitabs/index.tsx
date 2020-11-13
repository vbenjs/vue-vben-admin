import type { TabContentProps } from './tab.data';
import type { TabItem } from '/@/store/modules/tab';
import type { AppRouteRecordRaw } from '/@/router/types';

import { defineComponent, watch, computed, unref, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import router from '/@/router';

import { Tabs } from 'ant-design-vue';
import TabContent from './TabContent';

import { useGo } from '/@/hooks/web/usePage';

import { TabContentEnum } from './tab.data';

import { tabStore } from '/@/store/modules/tab';
import { userStore } from '/@/store/modules/user';

import { closeTab } from './useTabDropdown';
import { useTabs } from '/@/hooks/web/useTabs';

import './index.less';
export default defineComponent({
  name: 'MultiTabs',
  setup() {
    let isAddAffix = false;
    const go = useGo();
    const { currentRoute } = useRouter();
    const { activeKeyRef } = useTabs();

    // 当前tab列表
    const getTabsState = computed(() => {
      return tabStore.getTabsState;
    });

    // If you monitor routing changes, tab switching will be stuck. So use this method
    watch(
      () => tabStore.getLastChangeRouteState,
      () => {
        if (!isAddAffix) {
          addAffixTabs();
          isAddAffix = true;
        }

        const lastChangeRoute = unref(tabStore.getLastChangeRouteState);
        if (!lastChangeRoute || !userStore.getTokenState) return;

        const { path, fullPath } = lastChangeRoute;
        if (activeKeyRef.value !== (fullPath || path)) {
          activeKeyRef.value = fullPath || path;
        }
        tabStore.commitAddTab((lastChangeRoute as unknown) as AppRouteRecordRaw);
      },
      {
        immediate: true,
      }
    );

    /**
     * @description: 过滤所有固定路由
     */
    function filterAffixTabs(routes: AppRouteRecordRaw[]) {
      const tabs: TabItem[] = [];
      routes &&
        routes.forEach((route) => {
          if (route.meta && route.meta.affix) {
            tabs.push(toRaw(route) as TabItem);
          }
        });
      return tabs;
    }

    /**
     * @description: 设置固定tabs
     */
    function addAffixTabs(): void {
      const affixTabs = filterAffixTabs((router.getRoutes() as unknown) as AppRouteRecordRaw[]);
      for (const tab of affixTabs) {
        tabStore.commitAddTab(tab);
      }
    }

    // tab切换
    function handleChange(activeKey: any) {
      activeKeyRef.value = activeKey;
      go(activeKey, false);
    }

    // 关闭当前ab
    function handleEdit(targetKey: string) {
      // 新增操作隐藏，目前只使用删除操作
      const index = unref(getTabsState).findIndex(
        (item) => (item.fullPath || item.path) === targetKey
      );
      index !== -1 && closeTab(unref(getTabsState)[index]);
    }

    function renderQuick() {
      const tabContentProps: TabContentProps = {
        tabItem: (currentRoute as unknown) as AppRouteRecordRaw,
        type: TabContentEnum.EXTRA_TYPE,
        trigger: ['click', 'contextmenu'],
      };
      return (
        <span>
          <TabContent {...(tabContentProps as any)} />
        </span>
      );
    }
    function renderTabs() {
      return unref(getTabsState).map((item: TabItem) => {
        const key = item.query ? item.fullPath : item.path;

        return (
          <Tabs.TabPane key={key} closable={!(item && item.meta && item.meta.affix)}>
            {{
              tab: () => <TabContent tabItem={item} />,
            }}
          </Tabs.TabPane>
        );
      });
    }

    return () => {
      return (
        <div class="multiple-tabs">
          <Tabs
            type="editable-card"
            size="small"
            animated={false}
            hideAdd={true}
            tabBarGutter={4}
            activeKey={unref(activeKeyRef)}
            onChange={handleChange}
            onEdit={handleEdit}
          >
            {{
              default: () => renderTabs(),
              tabBarExtraContent: () => renderQuick(),
            }}
          </Tabs>
        </div>
      );
    };
  },
});
