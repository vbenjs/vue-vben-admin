import {
  DoubleRightOutlined,
  DoubleLeftOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue';
import { defineComponent } from 'vue';

// store
import { menuStore } from '/@/store/modules/menu';

export default defineComponent({
  name: 'LayoutTrigger',
  props: {
    sider: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
    },
  },
  setup(props) {
    function toggleMenu() {
      menuStore.commitCollapsedState(!menuStore.getCollapsedState);
    }

    return () => {
      const siderTrigger = menuStore.getCollapsedState ? (
        <DoubleRightOutlined />
      ) : (
        <DoubleLeftOutlined />
      );
      if (props.sider) return siderTrigger;

      return (
        <span class={['layout-trigger', props.theme]} onClick={toggleMenu}>
          {menuStore.getCollapsedState ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
      );
    };
  },
});
