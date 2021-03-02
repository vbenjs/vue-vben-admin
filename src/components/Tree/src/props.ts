import type { PropType } from 'vue';
import type { ReplaceFields, ActionItem, Keys, CheckKeys } from './types';
import type { ContextMenuItem } from '/@/hooks/web/useContextMenu';
import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

export const basicProps = {
  renderIcon: {
    type: Function as PropType<(params: Recordable) => string>,
  },
  replaceFields: {
    type: Object as PropType<ReplaceFields>,
  },

  treeData: {
    type: Array as PropType<TreeDataItem[]>,
  },

  actionList: {
    type: Array as PropType<ActionItem[]>,
    default: () => [],
  },

  expandedKeys: {
    type: Array as PropType<Keys>,
    default: () => [],
  },

  selectedKeys: {
    type: Array as PropType<Keys>,
    default: () => [],
  },

  checkedKeys: {
    type: Array as PropType<CheckKeys>,
    default: () => [],
  },

  beforeRightClick: {
    type: Function as PropType<(...arg: any) => ContextMenuItem[]>,
    default: null,
  },

  rightMenuList: {
    type: Array as PropType<ContextMenuItem[]>,
  },
};

export const treeNodeProps = {
  actionList: {
    type: Array as PropType<ActionItem[]>,
    default: () => [],
  },
  replaceFields: {
    type: Object as PropType<ReplaceFields>,
  },
  treeData: {
    type: Array as PropType<TreeDataItem[]>,
    default: () => [],
  },
};
