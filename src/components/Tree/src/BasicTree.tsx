import './index.less';

import type { ReplaceFields, TreeItem, Keys, CheckKeys, TreeActionType } from './types';

import { defineComponent, reactive, computed, unref, ref, watchEffect, CSSProperties } from 'vue';
import { Tree } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue';

import { useContextMenu, ContextMenuItem } from '/@/hooks/web/useContextMenu';

import { isFunction } from '/@/utils/is';
import { omit } from 'lodash-es';
import { extendSlots } from '/@/utils/helper/tsxHelper';

import { basicProps } from './props';
import { useTree } from './useTree';
import { useExpose } from '/@/hooks/core/useExpose';
import { onMounted } from 'vue';

interface State {
  expandedKeys: Keys;
  selectedKeys: Keys;
  checkedKeys: CheckKeys;
}
const prefixCls = 'basic-tree';
export default defineComponent({
  name: 'BasicTree',
  props: basicProps,
  emits: ['update:expandedKeys', 'update:selectedKeys', 'update:value', 'get'],
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

    const getContentStyle = computed(
      (): CSSProperties => {
        const { actionList } = props;
        const width = actionList.length * 18;
        return {
          width: `calc(100% - ${width}px)`,
        };
      }
    );

    const getBindValues = computed(() => {
      let propsData = {
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
      return propsData;
    });

    const getTreeData = computed((): TreeItem[] => unref(treeDataRef));

    const { deleteNodeByKey, insertNodeByKey, filterByLevel, updateNodeByKey } = useTree(
      treeDataRef,
      getReplaceFields
    );

    //  渲染操作按钮
    function renderAction(node: TreeItem) {
      const { actionList } = props;

      if (!actionList || actionList.length === 0) return;

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
          <Tree.TreeNode {...propsData} key={anyItem?.[keyField]}>
            {{
              title: () => (
                <span class={`${prefixCls}-title`}>
                  <span class={`${prefixCls}__content`} style={unref(getContentStyle)}>
                    {titleField && anyItem[titleField]}
                  </span>
                  <span class={`${prefixCls}__actions`}> {renderAction(item)}</span>
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

    watchEffect(() => {
      treeDataRef.value = props.treeData as TreeItem[];
      state.expandedKeys = props.expandedKeys;
      state.selectedKeys = props.selectedKeys;
      state.checkedKeys = props.checkedKeys;
    });

    const instance: TreeActionType = {
      setExpandedKeys,
      getExpandedKeys,
      setSelectedKeys,
      getSelectedKeys,
      setCheckedKeys,
      getCheckedKeys,
      insertNodeByKey,
      deleteNodeByKey,
      updateNodeByKey,
      filterByLevel: (level: number) => {
        state.expandedKeys = filterByLevel(level);
      },
    };

    useExpose<TreeActionType>(instance);

    onMounted(() => {
      emit('get', instance);
    });

    return () => {
      return (
        <Tree {...unref(getBindValues)} class={prefixCls}>
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
