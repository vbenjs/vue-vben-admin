import type { PropType, FunctionalComponent } from 'vue';

import { defineComponent, unref } from 'vue';
import {
  DoubleRightOutlined,
  DoubleLeftOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue';

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

const SiderTrigger: FunctionalComponent = () => {
  const { getCollapsed } = useMenuSetting();
  return unref(getCollapsed) ? <DoubleRightOutlined /> : <DoubleLeftOutlined />;
};

const HeaderTrigger: FunctionalComponent<{
  theme?: string;
}> = (props) => {
  const { toggleCollapsed, getCollapsed } = useMenuSetting();
  return (
    <span class={['layout-trigger', props.theme]} onClick={toggleCollapsed}>
      {unref(getCollapsed) ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    </span>
  );
};

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
    return () => {
      return props.sider ? <SiderTrigger /> : <HeaderTrigger theme={props.theme} />;
    };
  },
});
