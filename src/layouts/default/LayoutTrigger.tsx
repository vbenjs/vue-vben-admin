import type { PropType } from 'vue';

import { defineComponent, unref } from 'vue';
import {
  DoubleRightOutlined,
  DoubleLeftOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue';

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

export default defineComponent({
  name: 'LayoutTrigger',
  props: {
    sider: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    theme: {
      type: String as PropType<string>,
    },
  },
  setup(props) {
    const { toggleCollapsed, getCollapsed } = useMenuSetting();

    return () => {
      const siderTrigger = unref(getCollapsed) ? <DoubleRightOutlined /> : <DoubleLeftOutlined />;

      if (props.sider) {
        return siderTrigger;
      }

      return (
        <span class={['layout-trigger', props.theme]} onClick={toggleCollapsed}>
          {unref(getCollapsed) ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
      );
    };
  },
});
