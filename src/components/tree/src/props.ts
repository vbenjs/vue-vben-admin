import { PropOptions } from 'compatible-vue';
import { ReplaceFields, TreeItem, ActionItem, Keys, CheckKeys } from './types';
import { ContextMenuItem } from '@/hooks/functions/useContextMenu';

export const basicProps = {
  replaceFields: {
    type: Object,
  } as PropOptions<ReplaceFields>,

  treeData: {
    type: Array,
  } as PropOptions<TreeItem[]>,

  actionList: {
    type: Array,
    default: () => [],
  } as PropOptions<ActionItem[]>,

  expandedKeys: {
    type: Array,
    default: () => [],
  } as PropOptions<Keys>,

  selectedKeys: {
    type: Array,
    default: () => [],
  } as PropOptions<Keys>,

  checkedKeys: {
    type: Array,
    default: () => [],
  } as PropOptions<CheckKeys>,

  beforeRightClick: {
    type: Function,
    default: null,
  } as PropOptions<(...arg) => ContextMenuItem[]>,

  rightMenuList: {
    type: Array,
  } as PropOptions<ContextMenuItem[]>,
};
