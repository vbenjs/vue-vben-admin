import type { PropType } from 'vue';

import { defineComponent, unref, computed, FunctionalComponent } from 'vue';

import { TabItem, tabStore } from '/@/store/modules/tab';
import { getScaleAction, TabContentProps } from './data';

import { Dropdown } from '/@/components/Dropdown/index';
import { RightOutlined } from '@ant-design/icons-vue';

import { TabContentEnum } from './data';
import { useTabDropdown } from './useTabDropdown';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';

const ExtraContent: FunctionalComponent = () => {
  return (
    <span class={`multiple-tabs-content__extra `}>
      <RightOutlined />
    </span>
  );
};

const TabContent: FunctionalComponent<{ tabItem: TabItem }> = (props) => {
  const { tabItem: { meta } = {} } = props;

  function handleContextMenu(e: Event) {
    if (!props.tabItem) return;
    const tableItem = props.tabItem;
    e?.preventDefault();
    const index = unref(tabStore.getTabsState).findIndex((tab) => tab.path === tableItem.path);

    tabStore.commitCurrentContextMenuIndexState(index);
    tabStore.commitCurrentContextMenuState(props.tabItem);
  }

  return (
    <div class={`multiple-tabs-content__content `} onContextmenu={handleContextMenu}>
      <span class="ml-1">{meta && meta.title}</span>
    </div>
  );
};

export default defineComponent({
  name: 'TabContent',
  props: {
    tabItem: {
      type: Object as PropType<TabItem>,
      default: null,
    },

    type: {
      type: Number as PropType<TabContentEnum>,
      default: TabContentEnum.TAB_TYPE,
    },
  },
  setup(props) {
    const { getShowMenu } = useMenuSetting();
    const { getShowHeader } = useHeaderSetting();
    const { getShowQuick } = useMultipleTabSetting();

    const getIsScale = computed(() => {
      return !unref(getShowMenu) && !unref(getShowHeader);
    });

    const getIsTab = computed(() => {
      return !unref(getShowQuick) ? true : props.type === TabContentEnum.TAB_TYPE;
    });

    const { getDropMenuList, handleMenuEvent } = useTabDropdown(props as TabContentProps);

    return () => {
      const scaleAction = getScaleAction(unref(getIsScale) ? '收起' : '展开', unref(getIsScale));
      const dropMenuList = unref(getDropMenuList) || [];

      const isTab = unref(getIsTab);
      return (
        <Dropdown
          dropMenuList={!isTab ? [scaleAction, ...dropMenuList] : dropMenuList}
          trigger={isTab ? ['contextmenu'] : ['click']}
          onMenuEvent={handleMenuEvent}
        >
          {() => (isTab ? <TabContent tabItem={props.tabItem} /> : <ExtraContent />)}
        </Dropdown>
      );
    };
  },
});
