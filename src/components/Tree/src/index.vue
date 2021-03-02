<script lang="tsx">
  import type { ReplaceFields, Keys, CheckKeys, TreeActionType, TreeItem } from './types';

  import {
    defineComponent,
    reactive,
    computed,
    unref,
    ref,
    watchEffect,
    onMounted,
    toRaw,
  } from 'vue';
  import { Tree } from 'ant-design-vue';
  import { TreeIcon } from './TreeIcon';
  // import { DownOutlined } from '@ant-design/icons-vue';

  import { omit, get } from 'lodash-es';
  import { isBoolean, isFunction } from '/@/utils/is';
  import { extendSlots } from '/@/utils/helper/tsxHelper';

  import { useTree } from './useTree';
  import { useContextMenu, ContextMenuItem } from '/@/hooks/web/useContextMenu';
  import { useExpose } from '/@/hooks/core/useExpose';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { basicProps } from './props';

  interface State {
    expandedKeys: Keys;
    selectedKeys: Keys;
    checkedKeys: CheckKeys;
  }
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
      const { prefixCls } = useDesign('basic-tree');

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

      // const getContentStyle = computed(
      //   (): CSSProperties => {
      //     const { actionList } = props;
      //     const width = actionList.length * 18;
      //     return {
      //       width: `calc(100% - ${width}px)`,
      //     };
      //   }
      // );

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

      function getIcon(params: Recordable, icon?: string) {
        if (!icon) {
          if (props.renderIcon && isFunction(props.renderIcon)) {
            return props.renderIcon(params);
          }
        }
        return icon;
      }

      function renderAction(node: TreeItem) {
        const { actionList } = props;
        if (!actionList || actionList.length === 0) return;
        return actionList.map((item, index) => {
          if (isFunction(item.show)) {
            return item.show?.(node);
          }

          if (isBoolean(item.show)) {
            return item.show;
          }

          return (
            <span key={index} class={`${prefixCls}__action`}>
              {item.render(node)}
            </span>
          );
        });
      }

      function renderTreeNode({ data, level }: { data: TreeItem[] | undefined; level: number }) {
        if (!data) {
          return null;
        }
        return data.map((item) => {
          const { title: titleField, key: keyField, children: childrenField } = unref(
            getReplaceFields
          );

          const propsData = omit(item, 'title');
          const icon = getIcon({ ...item, level }, item.icon);
          return (
            <Tree.TreeNode {...propsData} node={toRaw(item)} key={get(item, keyField)}>
              {{
                title: () => (
                  <span class={`${prefixCls}-title`}>
                    {icon && <TreeIcon icon={icon} />}
                    <span
                      class={`${prefixCls}__content`}
                      //  style={unref(getContentStyle)}
                    >
                      {get(item, titleField)}
                    </span>
                    <span class={`${prefixCls}__actions`}> {renderAction({ ...item, level })}</span>
                  </span>
                ),
                default: () =>
                  renderTreeNode({ data: get(item, childrenField) || [], level: level + 1 }),
              }}
            </Tree.TreeNode>
          );
        });
      }

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
          <Tree {...unref(getBindValues)} showIcon={false} class={[prefixCls]}>
            {{
              // switcherIcon: () => <DownOutlined />,
              default: () => renderTreeNode({ data: unref(getTreeData), level: 1 }),
              ...extendSlots(slots),
            }}
          </Tree>
        );
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-tree';

  .@{prefix-cls} {
    position: relative;

    .ant-tree-node-content-wrapper {
      position: relative;

      .ant-tree-title {
        position: absolute;
        left: 0;
        width: 100%;
      }
    }

    &-title {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      padding-right: 10px;

      &:hover {
        .@{prefix-cls}__action {
          visibility: visible;
        }
      }
    }

    &__content {
      display: inline-block;
      overflow: hidden;
    }

    &__actions {
      position: absolute;
      top: 2px;
      right: 2px;
      display: flex;
    }

    &__action {
      margin-left: 4px;
      visibility: hidden;
    }
  }
</style>
