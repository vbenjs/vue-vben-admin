import type { TabContentProps } from './tab.data';
import type { TabItem } from '/@/store/modules/tab';
import type { AppRouteRecordRaw } from '/@/router/types';

import {
  defineComponent,
  watch,
  computed,
  // ref,
  unref,
  onMounted,
} from 'vue';
import { Tabs } from 'ant-design-vue';
import TabContent from './TabContent';

import { useGo } from '/@/hooks/web/usePage';

import { TabContentEnum } from './tab.data';

import { useRouter } from 'vue-router';

import { tabStore } from '/@/store/modules/tab';
import { closeTab } from './useTabDropdown';
import router from '/@/router';
import { useTabs } from '/@/hooks/web/useTabs';
import { PageEnum } from '/@/enums/pageEnum';

import './index.less';
export default defineComponent({
  name: 'MultiTabs',
  setup() {
    let isAddAffix = false;
    const go = useGo();
    const { currentRoute } = useRouter();
    const { addTab, activeKeyRef } = useTabs();
    onMounted(() => {
      addTab(unref(currentRoute).path as PageEnum);
    });

    // 当前激活tab
    // const activeKeyRef = ref<string>('');

    // 当前tab列表
    const getTabsState = computed(() => {
      return tabStore.getTabsState;
    });

    if (!isAddAffix) {
      addAffixTabs();
      isAddAffix = true;
    }

    watch(
      () => unref(currentRoute).path,
      (path) => {
        if (activeKeyRef.value !== path) {
          activeKeyRef.value = path;
        }
        // 监听路由的话虽然可以，但是路由切换的时间会造成卡顿现象？
        // 使用useTab的addTab的话，当用户手动调转，需要自行调用addTab
        // tabStore.commitAddTab((unref(currentRoute) as unknown) as AppRouteRecordRaw);
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
            tabs.push({
              path: route.path,
              name: route.name,
              meta: { ...route.meta },
            });
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
      const index = unref(getTabsState).findIndex((item) => item.path === targetKey);
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
          <TabContent {...tabContentProps} />
        </span>
      );
    }
    function renderTabs() {
      return unref(getTabsState).map((item: TabItem) => {
        return (
          <Tabs.TabPane key={item.path} closable={!(item && item.meta && item.meta.affix)}>
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
            hideAdd={true}
            tabBarGutter={2}
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
