<script lang="tsx">
  import type { ReplaceFields, Keys, CheckKeys, TreeActionType, TreeItem } from './types';

  import {
    defineComponent,
    reactive,
    computed,
    unref,
    ref,
    watchEffect,
    toRaw,
    watch,
    CSSProperties,
  } from 'vue';
  import { Tree, Empty } from 'ant-design-vue';
  import { TreeIcon } from './TreeIcon';
  import TreeHeader from './TreeHeader.vue';
  import { ScrollContainer } from '/@/components/Container';
  // import { DownOutlined } from '@ant-design/icons-vue';

  import { omit, get } from 'lodash-es';
  import { isBoolean, isFunction } from '/@/utils/is';
  import { extendSlots } from '/@/utils/helper/tsxHelper';
  import { filter } from '/@/utils/helper/treeHelper';

  import { useTree } from './useTree';
  import { useContextMenu, ContextMenuItem } from '/@/hooks/web/useContextMenu';
  import { useExpose } from '/@/hooks/core/useExpose';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { basicProps } from './props';

  interface State {
    expandedKeys: Keys;
    selectedKeys: Keys;
    checkedKeys: CheckKeys;
    checkStrictly: boolean;
  }
  export default defineComponent({
    name: 'BasicTree',
    inheritAttrs: false,
    props: basicProps,
    emits: ['update:expandedKeys', 'update:selectedKeys', 'update:value', 'change'],
    setup(props, { attrs, slots, emit }) {
      const state = reactive<State>({
        checkStrictly: props.checkStrictly,
        expandedKeys: props.expandedKeys || [],
        selectedKeys: props.selectedKeys || [],
        checkedKeys: props.checkedKeys || [],
      });

      const searchState = reactive({
        startSearch: false,
        searchData: [] as TreeItem[],
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
          checkStrictly: state.checkStrictly,
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
            const rawVal = toRaw(v);
            emit('change', rawVal);
            emit('update:value', rawVal);
          },
          onRightClick: handleRightClick,
          // onSelect: (k, e) => {
          //   setTimeout(() => {
          //     emit('select', k, e);
          //   }, 16);
          // },
        };
        propsData = omit(propsData, 'treeData', 'class');
        return propsData;
      });

      const getTreeData = computed((): TreeItem[] =>
        searchState.startSearch ? searchState.searchData : unref(treeDataRef)
      );

      const getNotFound = computed((): boolean => {
        return searchState.startSearch && searchState.searchData?.length === 0;
      });

      const {
        deleteNodeByKey,
        insertNodeByKey,
        filterByLevel,
        updateNodeByKey,
        getAllKeys,
      } = useTree(treeDataRef, getReplaceFields);

      function getIcon(params: Recordable, icon?: string) {
        if (!icon) {
          if (props.renderIcon && isFunction(props.renderIcon)) {
            return props.renderIcon(params);
          }
        }
        return icon;
      }

      async function handleRightClick({ event, node }: Recordable) {
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

      function setExpandedKeys(keys: Keys) {
        state.expandedKeys = keys;
      }

      function getExpandedKeys() {
        return state.expandedKeys;
      }
      function setSelectedKeys(keys: Keys) {
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

      function checkAll(checkAll: boolean) {
        state.checkedKeys = checkAll ? getAllKeys() : ([] as Keys);
      }

      function expandAll(expandAll: boolean) {
        state.expandedKeys = expandAll ? getAllKeys() : ([] as Keys);
      }

      function onStrictlyChange(strictly: boolean) {
        state.checkStrictly = strictly;
      }

      function handleSearch(searchValue: string) {
        if (!searchValue) {
          searchState.startSearch = false;
          return;
        }
        searchState.startSearch = true;
        const { title: titleField } = unref(getReplaceFields);

        searchState.searchData = filter(unref(treeDataRef), (node) => {
          return node[titleField]?.includes(searchValue) ?? false;
        });
      }

      function handleClickNode(key: string, children: TreeItem[]) {
        if (!props.clickRowToExpand || !children || children.length === 0) return;
        if (!state.expandedKeys.includes(key)) {
          setExpandedKeys([...state.expandedKeys, key]);
        } else {
          const keys = [...state.expandedKeys];
          const index = keys.findIndex((item) => item === key);
          if (index !== -1) {
            keys.splice(index, 1);
          }
          setExpandedKeys(keys);
        }
      }

      watchEffect(() => {
        treeDataRef.value = props.treeData as TreeItem[];
        state.expandedKeys = props.expandedKeys;
        state.selectedKeys = props.selectedKeys;
        state.checkedKeys = props.checkedKeys;
      });

      watch(
        () => props.value,
        () => {
          state.checkedKeys = toRaw(props.value || []);
        }
      );

      // watchEffect(() => {
      //   console.log('======================');
      //   console.log(props.value);
      //   console.log('======================');
      //   if (props.value) {
      //     state.checkedKeys = props.value;
      //   }
      // });

      watchEffect(() => {
        state.checkStrictly = props.checkStrictly;
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
        checkAll,
        expandAll,
        filterByLevel: (level: number) => {
          state.expandedKeys = filterByLevel(level);
        },
      };

      useExpose<TreeActionType>(instance);

      function renderAction(node: TreeItem) {
        const { actionList } = props;
        if (!actionList || actionList.length === 0) return;
        return actionList.map((item, index) => {
          let nodeShow = true;
          if (isFunction(item.show)) {
            nodeShow = item.show?.(node);
          } else if (isBoolean(item.show)) {
            nodeShow = item.show;
          }

          if (!nodeShow) return null;

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
          const children = get(item, childrenField) || [];
          return (
            <Tree.TreeNode {...propsData} node={toRaw(item)} key={get(item, keyField)}>
              {{
                title: () => (
                  <span
                    class={`${prefixCls}-title pl-2`}
                    onClick={handleClickNode.bind(null, item[keyField], item[childrenField])}
                  >
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
                default: () => renderTreeNode({ data: children, level: level + 1 }),
              }}
            </Tree.TreeNode>
          );
        });
      }
      return () => {
        const { title, helpMessage, toolbar, search, checkable } = props;
        const showTitle = title || toolbar || search;
        const scrollStyle: CSSProperties = { height: 'calc(100% - 38px)' };
        return (
          <div class={[prefixCls, 'h-full bg-white', attrs.class]}>
            {showTitle && (
              <TreeHeader
                checkable={checkable}
                checkAll={checkAll}
                expandAll={expandAll}
                title={title}
                search={search}
                toolbar={toolbar}
                helpMessage={helpMessage}
                onStrictlyChange={onStrictlyChange}
                onSearch={handleSearch}
              />
            )}
            <ScrollContainer style={scrollStyle} v-show={!unref(getNotFound)}>
              <Tree {...unref(getBindValues)} showIcon={false}>
                {{
                  // switcherIcon: () => <DownOutlined />,
                  default: () => renderTreeNode({ data: unref(getTreeData), level: 1 }),
                  ...extendSlots(slots),
                }}
              </Tree>
            </ScrollContainer>

            <Empty v-show={unref(getNotFound)} class="!mt-4" />
          </div>
        );
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-tree';

  .@{prefix-cls} {
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
      overflow: hidden;
    }

    &__actions {
      position: absolute;
      top: 2px;
      right: 3px;
      display: flex;
    }

    &__action {
      margin-left: 4px;
      visibility: hidden;
    }
  }
</style>
