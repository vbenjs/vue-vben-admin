import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons-vue';
import { defineComponent } from 'vue';

// store
import { menuStore } from '/@/store/modules/menu';

export default defineComponent({
  name: 'SideBarTrigger',
  setup() {
    return () => (menuStore.getCollapsedState ? <DoubleRightOutlined /> : <DoubleLeftOutlined />);
  },
});
