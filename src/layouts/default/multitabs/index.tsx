import './index.less';

import type { TabContentProps } from './tab.data';
import type { TabItem } from '/@/store/modules/tab';
import type { AppRouteRecordRaw } from '/@/router/types';

import { defineComponent, watch, computed, unref } from 'vue';
import { useRouter } from 'vue-router';

import { Tabs } from 'ant-design-vue';
import TabContent from './TabContent';

import { useGo } from '/@/hooks/web/usePage';

import { TabContentEnum } from './tab.data';

import { tabStore } from '/@/store/modules/tab';
import { userStore } from '/@/store/modules/user';

import { closeTab } from './useTabDropdown';
import { useTabs } from '/@/hooks/web/useTabs';
import { initAffixTabs } from './useAffixTabs';

export default defineComponent({
  name: 'MultipleTabs',
  setup() {
    initAffixTabs();

    const go = useGo();

    const { currentRoute } = useRouter();
    const { activeKeyRef } = useTabs();

    const getTabsState = computed(() => tabStore.getTabsState);

    // If you monitor routing changes, tab switching will be stuck. So setting this method
    watch(
      () => tabStore.getLastChangeRouteState,
      () => {
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

    // tab切换
    function handleChange(activeKey: any) {
      activeKeyRef.value = activeKey;
      go(activeKey, false);
    }

    // 关闭当前tab
    function handleEdit(targetKey: string) {
      // Added operation to hide, currently only use delete operation
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
        const closable = !(item && item.meta && item.meta.affix);
        return (
          <Tabs.TabPane key={key} closable={closable}>
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
