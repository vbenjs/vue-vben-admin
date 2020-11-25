import './index.less';

import type { TabContentProps } from './data';
import type { TabItem } from '/@/store/modules/tab';
import type { AppRouteRecordRaw } from '/@/router/types';

import { defineComponent, watch, computed, unref, ref, onMounted, nextTick } from 'vue';
import Sortable from 'sortablejs';

import { useRouter } from 'vue-router';

import { Tabs } from 'ant-design-vue';
import TabContent from './TabContent';

import { useGo } from '/@/hooks/web/usePage';

import { TabContentEnum } from './data';

import { tabStore } from '/@/store/modules/tab';
import { userStore } from '/@/store/modules/user';

import { closeTab } from './useTabDropdown';
import { initAffixTabs } from './useMultipleTabs';
import { isNullAndUnDef } from '/@/utils/is';
import { useProjectSetting } from '/@/hooks/setting';

export default defineComponent({
  name: 'MultipleTabs',
  setup() {
    const activeKeyRef = ref('');

    const affixTextList = initAffixTabs();

    const go = useGo();

    const { multiTabsSetting } = useProjectSetting();

    const { currentRoute } = useRouter();

    const getTabsState = computed(() => tabStore.getTabsState);

    // If you monitor routing changes, tab switching will be stuck. So setting this method
    watch(
      () => tabStore.getLastChangeRouteState,
      () => {
        const lastChangeRoute = unref(tabStore.getLastChangeRouteState);

        if (!lastChangeRoute || !userStore.getTokenState) return;

        const { path, fullPath } = lastChangeRoute as AppRouteRecordRaw;
        const p = fullPath || path;
        if (activeKeyRef.value !== p) {
          activeKeyRef.value = p;
        }
        tabStore.commitAddTab(lastChangeRoute);
      },
      {
        immediate: true,
      }
    );

    function handleChange(activeKey: any) {
      activeKeyRef.value = activeKey;
      go(activeKey, false);
    }

    // Close the current tab
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
      };
      return <TabContent {...(tabContentProps as any)} />;
    }

    function renderTabs() {
      return unref(getTabsState).map((item: TabItem) => {
        const key = item.query ? item.fullPath : item.path;
        const closable = !(item && item.meta && item.meta.affix);

        const slots = {
          tab: () => <TabContent tabItem={item} />,
        };
        return (
          <Tabs.TabPane key={key} closable={closable}>
            {slots}
          </Tabs.TabPane>
        );
      });
    }

    function initSortableTabs() {
      if (!multiTabsSetting.canDrag) return;
      nextTick(() => {
        const el = document.querySelectorAll(
          '.multiple-tabs .ant-tabs-nav > div'
        )?.[0] as HTMLElement;

        if (!el) return;
        Sortable.create(el, {
          animation: 500,
          delay: 400,
          delayOnTouchOnly: true,
          filter: (e: ChangeEvent) => {
            const text = e?.target?.innerText;
            if (!text) return false;
            return affixTextList.includes(text);
          },
          onEnd: (evt) => {
            const { oldIndex, newIndex } = evt;

            if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
              return;
            }

            tabStore.commitSortTabs({ oldIndex, newIndex });
          },
        });
      });
    }

    onMounted(() => {
      initSortableTabs();
    });

    return () => {
      const slots = {
        default: () => renderTabs(),
        tabBarExtraContent: () => renderQuick(),
      };
      return (
        <div class="multiple-tabs">
          <Tabs
            type="editable-card"
            size="small"
            animated={false}
            hideAdd={true}
            tabBarGutter={3}
            activeKey={unref(activeKeyRef)}
            onChange={handleChange}
            onEdit={handleEdit}
          >
            {slots}
          </Tabs>
        </div>
      );
    };
  },
});
