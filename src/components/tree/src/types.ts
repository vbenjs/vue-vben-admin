export interface ActionItem {
  render: (record: any) => any;
}

export interface TreeItem {
  /**
   * Class
   * @description className
   * @type string
   */
  class?: string;

  /**
   * Style
   * @description style of tree node
   * @type string | object
   */
  style?: string | object;

  /**
   * Disable Checkbox
   * @description Disables the checkbox of the treeNode
   * @default false
   * @type boolean
   */
  disableCheckbox?: boolean;

  /**
   * Disabled
   * @description Disabled or not
   * @default false
   * @type boolean
   */
  disabled?: boolean;

  /**
   * Icon
   * @description customize icon. When you pass component, whose render will receive full TreeNode props as component props
   * @type any (slot | slot-scope)
   */
  icon?: any;

  /**
   * Is Leaf?
   * @description Leaf node or not
   * @default false
   * @type boolean
   */
  isLeaf?: boolean;

  /**
   * Key
   * @description Required property, should be unique in the tree
   * (In tree: Used with (default)ExpandedKeys / (default)CheckedKeys / (default)SelectedKeys)
   * @default internal calculated position of treeNode or undefined
   * @type string | number
   */
  key: string | number;

  /**
   * Selectable
   * @description Set whether the treeNode can be selected
   * @default true
   * @type boolean
   */
  selectable?: boolean;

  /**
   * Title
   * @description Content showed on the treeNodes
   * @default '---'
   * @type any (string | slot)
   */
  title: any;

  /**
   * Value
   * @description Will be treated as treeNodeFilterProp by default, should be unique in the tree
   * @default undefined
   * @type string
   */
  value?: string;
  children?: TreeItem[];
  slots?: any;
  scopedSlots?: any;
}

export interface ReplaceFields {
  children?: string;
  title?: string;
  key?: string;
}

export type Keys = string[] | number[];
export type CheckKeys =
  | string[]
  | number[]
  | { checked: string[] | number[]; halfChecked: string[] | number[] };

export interface TreeActionType {
  setExpandedKeys: (keys: Keys) => void;
  getExpandedKeys: () => Keys;
  setSelectedKeys: (keys: Keys) => void;
  getSelectedKeys: () => Keys;
  setCheckedKeys: (keys: CheckKeys) => void;
  getCheckedKeys: () => CheckKeys;
  filterByLevel: (level: number) => void;
  insertNodeByKey: (opt: InsertNodeParams) => void;
  deleteNodeByKey: (key: string) => void;
  updateNodeByKey: (key: string, node: Omit<TreeItem, 'key'>) => void;
}

export interface InsertNodeParams {
  parentKey: string | null;
  node: TreeItem;
  list?: TreeItem[];
  push?: 'push' | 'unshift';
}
