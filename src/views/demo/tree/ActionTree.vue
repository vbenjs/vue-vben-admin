<template>
  <PageWrapper title="Tree函数操作示例" contentBackground contentClass="p-4">
    <div class="mb-4" v-for="item in treeDataActions" :key="item.id">
      <a-button v-for="i in item.children" :key="i.id" @click="i.click" class="mr-2">
        {{ i.name }}
      </a-button>
    </div>
    <BasicTree :treeData="treeData" title="函数操作" ref="treeRef" :checkable="true" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicTree, TreeActionType } from '/@/components/Tree/index';
  import { treeData } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page';
  import { type Nullable } from '@vben/types';

  const treeRef = ref<Nullable<TreeActionType>>(null);
  const { createMessage } = useMessage();

  const treeDataActions = [
    {
      id: '1',
      name: '第一行',
      children: [
        {
          id: '1-1',
          name: '展开全部',
          click: () => expandAll(true),
        },
        {
          id: '1-2',
          name: '折叠全部',
          click: () => expandAll(false),
        },
        {
          id: '1-3',
          name: '全选',
          click: () => checkAll(true),
        },
        {
          id: '1-4',
          name: '全不选',
          click: () => checkAll(false),
        },
        {
          id: '1-5',
          name: '显示到第2级',
          click: () => handleLevel(2),
        },
        {
          id: '1-6',
          name: '显示到第1级',
          click: () => handleLevel(1),
        },
      ],
    },
    {
      id: '2',
      name: '第二行',
      children: [
        {
          id: '2-1',
          name: '设置勾选数据',
          click: () => handleSetCheckData(),
        },
        {
          id: '2-2',
          name: '获取勾选数据',
          click: () => handleGetCheckData(),
        },
        {
          id: '2-3',
          name: '设置选中数据',
          click: () => handleSetSelectData(),
        },
        {
          id: '2-4',
          name: '获取选中数据',
          click: () => handleGetSelectData(),
        },
        {
          id: '2-5',
          name: '获取选中节点',
          click: () => handleGetSelectNode(),
        },
        {
          id: '2-6',
          name: '获取Tree数据',
          click: () => handleGetTreeData(),
        },
        {
          id: '2-7',
          name: '设置展开数据',
          click: () => handleSetExpandData(),
        },
        {
          id: '2-8',
          name: '获取展开数据',
          click: () => handleGetExpandData(),
        },
      ],
    },
    {
      id: '3',
      name: '第三行',
      children: [
        {
          id: '3-1',
          name: '添加根节点',
          click: () => appendNodeByKey(null),
        },
        {
          id: '3-2',
          name: '添加在parent3内添加节点',
          click: () => appendNodeByKey('2-2'),
        },
        {
          id: '3-3',
          name: '删除parent3节点',
          click: () => deleteNodeByKey('2-2'),
        },
        {
          id: '3-4',
          name: '更新parent2节点',
          click: () => updateNodeByKey('1-1'),
        },
      ],
    },
  ];

  function getTree() {
    const tree = unref(treeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  }

  function handleLevel(level: number) {
    getTree().filterByLevel(level);
  }

  function handleSetCheckData() {
    getTree().setCheckedKeys(['0-0']);
  }

  function handleGetCheckData() {
    const keys = getTree().getCheckedKeys();
    createMessage.success(JSON.stringify(keys));
  }

  function handleSetSelectData() {
    getTree().setSelectedKeys(['0-0']);
  }

  function handleGetSelectData() {
    const keys = getTree().getSelectedKeys();
    createMessage.success(JSON.stringify(keys));
  }

  function handleGetSelectNode() {
    const keys = getTree().getSelectedKeys();
    const node = getTree().getSelectedNode(keys[0]);
    createMessage.success(node !== null ? JSON.stringify(node) : null);
  }

  function handleSetExpandData() {
    getTree().setExpandedKeys(['0-0']);
  }

  function handleGetExpandData() {
    const keys = getTree().getExpandedKeys();
    createMessage.success(JSON.stringify(keys));
  }

  function checkAll(checkAll: boolean) {
    getTree().checkAll(checkAll);
  }

  function expandAll(checkAll: boolean) {
    getTree().expandAll(checkAll);
  }

  function appendNodeByKey(parentKey: string | null = null) {
    getTree().insertNodeByKey({
      parentKey: parentKey,
      node: {
        title: '新增节点',
        key: '2-2-2',
      },
      // 往后插入
      push: 'push',
      // 往前插入
      // push:'unshift'
    });
  }

  function deleteNodeByKey(key: string) {
    getTree().deleteNodeByKey(key);
  }

  function updateNodeByKey(key: string) {
    getTree().updateNodeByKey(key, {
      title: 'parent2-new',
    });
  }

  function handleGetTreeData() {
    const treeDataRef = getTree().getTreeData();
    createMessage.success(JSON.stringify(treeDataRef.value));
  }
</script>
