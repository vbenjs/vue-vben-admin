import type { SmartTableToolbarSizeSetting } from '@/components/SmartTable';
import type { SizeType, VxeButtonProps } from 'vxe-table';

import { defineComponent, h, onMounted } from 'vue';

import { Menu, Dropdown } from 'ant-design-vue';
import { ColumnHeightOutlined } from '@ant-design/icons-vue';
import { t as vxeI18n } from 'vxe-table';

import { useTableContext } from '../hooks/useSmartTableContext';

const SMART_TABLE_SIZE_SETTING = 'SMART_TABLE_SIZE_SETTING';

const getTableSize = (tableId: string) => {
  return JSON.parse(localStorage.getItem(SMART_TABLE_SIZE_SETTING) || '{}')[tableId];
};

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
      setTableSize(e.key);
    };
    const setTableSize = (size: SizeType) => {
      const tableId = tableContext.getTableInstance()?.id;
      if (!tableId) {
        return;
      }
      const allConfig = JSON.parse(localStorage.getItem(SMART_TABLE_SIZE_SETTING) || '{}') || {};
      allConfig[tableId] = size;
      localStorage.setItem(SMART_TABLE_SIZE_SETTING, JSON.stringify(allConfig));
    };

    onMounted(() => {
      const tableId = tableContext.getTableInstance()?.id;
      if (!tableId) {
        return;
      }
      if (tableContext.getTableInstance()?.customConfig?.storage !== true) {
        return;
      }
      const size = getTableSize(tableId);
      if (size) {
        tableContext.setProps({
          size,
        });
      }
    });
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
