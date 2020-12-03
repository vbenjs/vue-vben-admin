import type { PropType } from 'vue';
import { Dropdown } from '/@/components/Dropdown/index';

import { defineComponent, unref, FunctionalComponent } from 'vue';

import { TabContentProps } from './types';

import { RightOutlined } from '@ant-design/icons-vue';

import { TabContentEnum } from './types';

import { useTabDropdown } from './useTabDropdown';
import { useI18n } from '/@/hooks/web/useI18n';

import { RouteLocationNormalized } from 'vue-router';

const { t: titleT } = useI18n();

const ExtraContent: FunctionalComponent = () => {
  return (
    <span class={`multiple-tabs-content__extra `}>
      <RightOutlined />
    </span>
  );
};

const TabContent: FunctionalComponent<{ tabItem: RouteLocationNormalized; handler: Fn }> = (
  props
) => {
  const { tabItem: { meta } = {} } = props;

  return (
    <div class={`multiple-tabs-content__content `} onContextmenu={props.handler(props.tabItem)}>
      <span class="ml-1">{meta && titleT(meta.title)}</span>
    </div>
  );
};

export default defineComponent({
  name: 'TabContent',
  props: {
    tabItem: {
      type: Object as PropType<RouteLocationNormalized>,
      default: null,
    },

    type: {
      type: Number as PropType<TabContentEnum>,
      default: TabContentEnum.TAB_TYPE,
    },
  },
  setup(props) {
    const {
      getDropMenuList,
      handleMenuEvent,
      handleContextMenu,
      getTrigger,
      isTabs,
    } = useTabDropdown(props as TabContentProps);

    return () => {
      return (
        <Dropdown
          dropMenuList={unref(getDropMenuList)}
          trigger={unref(getTrigger)}
          onMenuEvent={handleMenuEvent}
        >
          {() => {
            if (!unref(isTabs)) {
              return <ExtraContent />;
            }
            return <TabContent handler={handleContextMenu} tabItem={props.tabItem} />;
          }}
        </Dropdown>
      );
    };
  },
});
