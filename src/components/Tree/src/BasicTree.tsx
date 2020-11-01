import type { ReplaceFields, TreeItem, Keys, CheckKeys, InsertNodeParams } from './types';

import { defineComponent, reactive, computed, unref, ref, watchEffect } from 'vue';
import { Tree } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue';

import { useContextMenu, ContextMenuItem } from '/@/hooks/web/useContextMenu';

import { isFunction } from '/@/utils/is';
import { omit, cloneDeep } from 'lodash-es';
import { forEach } from '/@/utils/helper/treeHelper';
import { extendSlots } from '/@/utils/helper/tsxHelper';
import { tryTsxEmit } from '/@/utils/helper/vueHelper';

import { basicProps } from './props';

import './index.less';

interface State {
  expandedKeys: Keys;
  selectedKeys: Keys;
  checkedKeys: CheckKeys;
}
const prefixCls = 'basic-tree';
export default defineComponent({
  name: 'BasicTree',
  props: basicProps,
  emits: ['update:expandedKeys', 'update:selectedKeys', 'update:value'],
  setup(props, { attrs, slots, emit }) {
    const state = reactive<State>({
      expandedKeys: props.expandedKeys || [],
      selectedKeys: props.selectedKeys || [],
      checkedKeys: props.checkedKeys || [],
    });

    const treeDataRef = ref<TreeItem[]>([]);

    const [createContextMenu] = useContextMenu();

    const getReplaceFields = computed(
      (): Required<ReplaceFields> => {
        const { replaceFields } = props;
        return {
          children: 'children',
          title: 'title',
          key: 'key',
          ...replaceFields,
        };
      }
    );

    const getTreeData = computed(() => {
      return unref(treeDataRef);
    });

    //  渲染操作按钮
    function renderAction(node: TreeItem) {
      const { actionList } = props;

      if (!actionList || actionList.length === 0) {
        return;
      }

      return actionList.map((item, index) => {
        return (
          <span key={index} class={`${prefixCls}__action`}>
            {item.render(node)}
          </span>
        );
      });
    }
    // 渲染树节点
    function renderTreeNode({ data }: { data: TreeItem[] | undefined }) {
      if (!data) {
        return null;
      }
      return data.map((item) => {
        const { title: titleField, key: keyField, children: childrenField } = unref(
          getReplaceFields
        );
        const propsData = omit(item, 'title');
        const anyItem = item as any;
        return (
          <Tree.TreeNode {...propsData} key={keyField && anyItem[keyField]}>
            {{
              title: () => (
                <span class={`${prefixCls}-title`}>
                  {titleField && anyItem[titleField]}
                  {renderAction(item)}
                </span>
              ),
              default: () => renderTreeNode({ data: childrenField ? anyItem[childrenField] : [] }),
            }}
          </Tree.TreeNode>
        );
      });
    }

    // 处理右键事件
    async function handleRightClick({ event, node }: any) {
      const { rightMenuList: menuList = [], beforeRightClick } = props;
      let rightMenuList: ContextMenuItem[] = [];
      if (beforeRightClick && isFunction(beforeRightClick)) {
        rightMenuList = await beforeRightClick(node);
      } else {
        rightMenuList = menuList;
      }
      if (!rightMenuList.length) return;
      createContextMenu({
        event,
        items: rightMenuList,
      });
    }

    function setExpandedKeys(keys: string[]) {
      state.expandedKeys = keys;
    }

    function getExpandedKeys() {
      return state.expandedKeys;
    }
    function setSelectedKeys(keys: string[]) {
      state.selectedKeys = keys;
    }

    function getSelectedKeys() {
      return state.selectedKeys;
    }

    function setCheckedKeys(keys: CheckKeys) {
      state.checkedKeys = keys;
    }

    function getCheckedKeys() {
      return state.checkedKeys;
    }

    // 展开指定级别
    function filterByLevel(level = 1, list?: TreeItem[], currentLevel = 1) {
      if (!level) {
        return [];
      }
      const res: (string | number)[] = [];
      const data = list || props.treeData || [];
      for (let index = 0; index < data.length; index++) {
        const item = data[index] as any;

        const { key: keyField, children: childrenField } = unref(getReplaceFields);
        const key = keyField ? item[keyField] : '';
        const children = childrenField ? item[childrenField] : [];
        res.push(key);
        if (children && children.length && currentLevel < level) {
          currentLevel += 1;
          res.push(...filterByLevel(level, children, currentLevel));
        }
      }
      return res as string[] | number[];
    }

    /**
     * 添加节点
     */
    function insertNodeByKey({ parentKey = null, node, push = 'push' }: InsertNodeParams) {
      const treeData: any = cloneDeep(unref(treeDataRef));
      if (!parentKey) {
        treeData[push](node);
        treeDataRef.value = treeData;
        return;
      }
      const { key: keyField, children: childrenField } = unref(getReplaceFields);
      forEach(treeData, (treeItem) => {
        if (treeItem[keyField] === parentKey) {
          treeItem[childrenField] = treeItem[childrenField] || [];
          treeItem[childrenField][push](node);
        }
      });
      treeDataRef.value = treeData;
    }

    // 删除节点
    function deleteNodeByKey(key: string, list: TreeItem[]) {
      if (!key) return;
      const treeData = list || unref(treeDataRef);
      const { key: keyField, children: childrenField } = unref(getReplaceFields);

      for (let index = 0; index < treeData.length; index++) {
        const element: any = treeData[index];
        const children = element[childrenField];

        if (element[keyField] === key) {
          treeData.splice(index, 1);
          break;
        } else if (children && children.length) {
          deleteNodeByKey(key, element[childrenField]);
        }
      }
    }

    // 更新节点
    function updateNodeByKey(key: string, node: TreeItem, list: TreeItem[]) {
      if (!key) return;
      const treeData = list || unref(treeDataRef);
      const { key: keyField, children: childrenField } = unref(getReplaceFields);

      for (let index = 0; index < treeData.length; index++) {
        const element: any = treeData[index];
        const children = element[childrenField];

        if (element[keyField] === key) {
          treeData[index] = { ...treeData[index], ...node };
          break;
        } else if (children && children.length) {
          updateNodeByKey(key, node, element[childrenField]);
        }
      }
    }

    watchEffect(() => {
      treeDataRef.value = props.treeData as TreeItem[];
      state.expandedKeys = props.expandedKeys;
      state.selectedKeys = props.selectedKeys;
      state.checkedKeys = props.checkedKeys;
    });

    tryTsxEmit((currentInstance) => {
      currentInstance.setExpandedKeys = setExpandedKeys;
      currentInstance.getExpandedKeys = getExpandedKeys;
      currentInstance.setSelectedKeys = setSelectedKeys;
      currentInstance.getSelectedKeys = getSelectedKeys;
      currentInstance.setCheckedKeys = setCheckedKeys;
      currentInstance.getCheckedKeys = getCheckedKeys;
      currentInstance.insertNodeByKey = insertNodeByKey;
      currentInstance.deleteNodeByKey = deleteNodeByKey;
      currentInstance.updateNodeByKey = updateNodeByKey;
      currentInstance.filterByLevel = (level: number) => {
        state.expandedKeys = filterByLevel(level);
      };
    });
    return () => {
      let propsData: any = {
        blockNode: true,
        ...attrs,
        ...props,
        expandedKeys: state.expandedKeys,
        selectedKeys: state.selectedKeys,
        checkedKeys: state.checkedKeys,
        replaceFields: unref(getReplaceFields),
        'onUpdate:expandedKeys': (v: Keys) => {
          state.expandedKeys = v;
          emit('update:expandedKeys', v);
        },
        'onUpdate:selectedKeys': (v: Keys) => {
          state.selectedKeys = v;
          emit('update:selectedKeys', v);
        },
        onCheck: (v: CheckKeys) => {
          state.checkedKeys = v;
          emit('update:value', v);
        },
        onRightClick: handleRightClick,
      };
      propsData = omit(propsData, 'treeData');
      return (
        <Tree {...propsData} class={prefixCls}>
          {{
            switcherIcon: () => <DownOutlined />,
            default: () => renderTreeNode({ data: unref(getTreeData) }),
            ...extendSlots(slots),
          }}
        </Tree>
      );
    };
  },
});
