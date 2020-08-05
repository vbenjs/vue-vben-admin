<script lang="tsx">
  import {
    defineComponent,
    reactive,
    getCurrentInstance,
    watch,
    computed,
    unref,
  } from 'compatible-vue';
  import { Tree } from 'ant-design-vue';
  import { Icon } from '@/components/icon/index';

  import { extendSlots } from '@/utils/helper/tsxHelper';

  import { useDesign } from '@/hooks/core/useDesign';
  import { useContextMenu, ContextMenuItem } from '@/hooks/functions/useContextMenu';

  // import { TreeItem } from './types';
  // import { renderTreeNode } from './renderTreeNode';

  import { basicProps } from './props';
  import { ReplaceFields, TreeItem, Keys, CheckKeys } from './types';
  import { isFunction } from '@/utils/is/index';

  interface State {
    expandedKeys: Keys;
    selectedKeys: Keys;
    checkedKeys: CheckKeys;
  }
  export default defineComponent({
    name: 'BasicTree',
    props: basicProps,
    setup(props, { attrs, slots, listeners, emit }) {
      const state = reactive<State>({
        expandedKeys: props.expandedKeys || [],
        selectedKeys: props.selectedKeys || [],
        checkedKeys: props.checkedKeys || [],
      });

      const [createContextMenu] = useContextMenu();

      const { prefixCls } = useDesign('basic-tree');

      const getReplaceFields = computed(
        (): ReplaceFields => {
          const { replaceFields } = props;
          return {
            children: 'children',
            title: 'title',
            key: 'key',
            ...replaceFields,
          };
        }
      );

      function renderAction(node: TreeItem) {
        const { actionList } = props;

        if (!actionList || actionList.length === 0) {
          return;
        }
        return actionList.map((item) => {
          return <span class={`${prefixCls}__action`}>{item.render(node)}</span>;
        });
      }
      function renderTreeNode({ data }: { data: TreeItem[] | undefined }) {
        if (!data) {
          return null;
        }

        return data.map((item) => {
          const { title: titleField, key: keyField, children: childrenField } = unref(
            getReplaceFields
          );
          return (
            <Tree.TreeNode
              key={keyField && item[keyField]}
              {...{
                props: {
                  ...item,
                  title: undefined,
                },
              }}
            >
              <span slot="title" class={`${prefixCls}-title`}>
                {titleField && item[titleField]}
                {renderAction(item)}
              </span>
              {renderTreeNode({ data: childrenField ? item[childrenField] : [] })}
            </Tree.TreeNode>
          );
        });
      }

      async function handleRightClick({ event, node }) {
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
          const item = data[index];

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
      watch(
        () => props.expandedKeys,
        (keys: Keys) => {
          state.expandedKeys = keys;
        },
        {
          immediate: true,
        }
      );
      watch(
        () => props.selectedKeys,
        (keys: Keys) => {
          state.selectedKeys = keys;
        },
        {
          immediate: true,
        }
      );
      watch(
        () => props.checkedKeys,
        (keys: CheckKeys) => {
          state.checkedKeys = keys;
        },
        {
          immediate: true,
        }
      );

      const currentInstace = getCurrentInstance() as any;
      if (getCurrentInstance()) {
        currentInstace.setExpandedKeys = setExpandedKeys;
        currentInstace.getExpandedKeys = getExpandedKeys;
        currentInstace.setSelectedKeys = setSelectedKeys;
        currentInstace.getSelectedKeys = getSelectedKeys;
        currentInstace.setCheckedKeys = setCheckedKeys;
        currentInstace.getCheckedKeys = getCheckedKeys;
        currentInstace.filterByLevel = (level: number) => {
          state.expandedKeys = filterByLevel(level);
        };
      }

      return () => {
        const propsData = {
          blockNode: true,
          ...attrs,
          ...props,
          expandedKeys: state.expandedKeys,
          selectedKeys: state.selectedKeys,
          checkedKeys: state.checkedKeys,
          replaceFields: unref(getReplaceFields),
        };
        const { treeData, ...restProps } = propsData;
        return (
          <div class={prefixCls}>
            <Tree
              on={{
                rightClick: handleRightClick,
                ...listeners,
                'update:expandedKeys': (v: Keys) => {
                  state.expandedKeys = v;
                  emit('update:expandedKeys', v);
                },
                'update:selectedKeys': (v: Keys) => {
                  state.selectedKeys = v;
                  emit('update:selectedKeys', v);
                },
                check: (v: CheckKeys) => {
                  state.checkedKeys = v;
                  emit('input', v);
                },
              }}
              {...{
                props: restProps,
              }}
            >
              <Icon slot="switcherIcon" type="down" />
              {renderTreeNode({ data: treeData })}
              {extendSlots(slots)}
            </Tree>
          </div>
        );
      };
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-basic-tree';

  .@{prefix-cls} {
    position: relative;

    &-title {
      display: inline-block;
      width: 100%;
      padding-right: 10px;
      .@{prefix-cls}__action {
        display: none;
        float: right;
      }

      &:hover {
        .@{prefix-cls}__action {
          display: inline-block;
        }
      }
    }
  }
</style>
