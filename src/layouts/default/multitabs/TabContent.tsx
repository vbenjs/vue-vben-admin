import { defineComponent, unref, computed } from 'vue';

import type { PropType } from 'vue';

import { TabItem, tabStore } from '/@/store/modules/tab';
import { getScaleAction, TabContentProps } from './tab.data';

import { Dropdown } from '/@/components/Dropdown/index';
import Icon from '/@/components/Icon/index';
import { RightOutlined } from '@ant-design/icons-vue';
import { appStore } from '/@/store/modules/app';

import { TabContentEnum } from './tab.data';
import { useTabDropdown } from './useTabDropdown';

export default defineComponent({
  name: 'TabContent',
  props: {
    tabItem: {
      type: Object as PropType<TabItem>,
      default: null,
    },
    type: {
      type: Number as PropType<number>,
      default: TabContentEnum.TAB_TYPE,
    },
    trigger: {
      type: Array as PropType<string[]>,
      default: () => {
        return ['contextmenu'];
      },
    },
  },
  setup(props) {
    const getProjectConfigRef = computed(() => {
      return appStore.getProjectConfig;
    });

    const getIsScaleRef = computed(() => {
      const {
        menuSetting: { show: showMenu },
        headerSetting: { show: showHeader },
      } = unref(getProjectConfigRef);
      return !showMenu && !showHeader;
    });

    function handleContextMenu(e: Event) {
      if (!props.tabItem) return;
      const tableItem = props.tabItem;
      e.preventDefault();
      const index = unref(tabStore.getTabsState).findIndex((tab) => tab.path === tableItem.path);

      tabStore.commitCurrentContextMenuIndexState(index);
      tabStore.commitCurrentContextMenuState(props.tabItem);
    }

    /**
     * @description: 渲染图标
     */
    function renderIcon() {
      const { tabItem } = props;
      if (!tabItem) return;
      const icon = tabItem.meta && tabItem.meta.icon;
      if (!icon || !unref(getProjectConfigRef).multiTabsSetting.showIcon) return null;
      return <Icon icon={icon} class="align-middle " style={{ marginBottom: '2px' }} />;
    }
    function renderTabContent() {
      const { tabItem: { meta } = {} } = props;
      return (
        <div class={`multiple-tabs-content__content `} onContextmenu={handleContextMenu}>
          {renderIcon()}
          <span class="ml-1">{meta && meta.title}</span>
        </div>
      );
    }
    function renderExtraContent() {
      return (
        <span class={`multiple-tabs-content__extra `}>
          <RightOutlined />
        </span>
      );
    }

    const { getDropMenuList, handleMenuEvent } = useTabDropdown(props as TabContentProps);

    return () => {
      const { trigger, type } = props;
      const {
        multiTabsSetting: { showQuick },
      } = unref(getProjectConfigRef);

      const isTab = !showQuick ? true : type === TabContentEnum.TAB_TYPE;
      const scaleAction = getScaleAction(
        unref(getIsScaleRef) ? '缩小' : '放大',
        unref(getIsScaleRef)
      );
      const dropMenuList = unref(getDropMenuList) || [];

      return (
        <Dropdown
          dropMenuList={!isTab ? [scaleAction, ...dropMenuList] : dropMenuList}
          trigger={isTab ? trigger : ['hover']}
          onMenuEvent={handleMenuEvent}
        >
          {() => (isTab ? renderTabContent() : renderExtraContent())}
        </Dropdown>
      );
    };
  },
});
