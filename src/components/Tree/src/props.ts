import type { PropType } from 'vue';
import type { ReplaceFields, ActionItem, Keys, CheckKeys } from './types';
import type { ContextMenuItem } from '/@/hooks/web/useContextMenu';
import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';
import { propTypes } from '/@/utils/propTypes';

export const basicProps = {
  value: {
    type: Array as PropType<Keys>,
  },
  renderIcon: {
    type: Function as PropType<(params: Recordable) => string>,
  },

  helpMessage: {
    type: [String, Array] as PropType<string | string[]>,
    default: '',
  },

  title: propTypes.string,
  toolbar: propTypes.bool,
  search: propTypes.bool,
  checkStrictly: propTypes.bool,
  clickRowToExpand: propTypes.bool.def(true),
  checkable: propTypes.bool.def(false),

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
