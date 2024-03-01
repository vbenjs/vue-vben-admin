import type { SmartTableToolbarSizeSetting } from '@/components/SmartTable';
import type { VxeButtonProps } from 'vxe-table';

import { defineComponent, h } from 'vue';

import { Menu, Dropdown } from 'ant-design-vue';
import { ColumnHeightOutlined } from '@ant-design/icons-vue';
import { t as vxeI18n } from 'vxe-table';

import { useTableContext } from '../hooks/useSmartTableContext';

export default defineComponent({
  name: 'SmartTableSizeSetting',
  props: {
    config: {
      type: Object as PropType<SmartTableToolbarSizeSetting>,
      default: () => ({}),
    },
  },
  setup() {
    const tableContext = useTableContext();
    const handleChangeSize = (e) => {
      tableContext.setProps({
        size: e.key,
      });
    };
    return {
      handleChangeSize,
    };
  },
  render() {
    const { config, handleChangeSize } = this;
    const slots = {
      default: renderButton(config),
      overlay: renderOverlay(config, handleChangeSize),
    };
    return <Dropdown>{slots}</Dropdown>;
  },
});

const renderOverlay = (config: SmartTableToolbarSizeSetting, handleChangeSize: Function) => {
  return () => {
    return (
      <Menu onClick={(e) => handleChangeSize(e)}>
        <Menu.Item key="middle">大</Menu.Item>
        <Menu.Item key="small">中等</Menu.Item>
        <Menu.Item key="mini">紧凑</Menu.Item>
      </Menu>
    );
  };
};

const renderButton = (config: SmartTableToolbarSizeSetting) => {
  const props: VxeButtonProps = {
    circle: true,
    icon: 'vxe-icon-chart-radar',
    ...config.buttonProps,
  };
  const slots = {
    icon: () => h(ColumnHeightOutlined),
  };
  return () => {
    return (
      <vxe-button title={vxeI18n('smart_table.toolbar.sizeSetting')} {...props}>
        {slots}
      </vxe-button>
    );
  };
};
