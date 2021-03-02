<template>
  <PageWrapper title="Tree函数操作示例" contentBackground contentClass="p-4">
    <div class="mb-4">
      <a-button @click="handleLevel(2)" class="mr-2"> 显示到第2级 </a-button>
      <a-button @click="handleLevel(1)" class="mr-2"> 显示到第1级 </a-button>
      <a-button @click="handleSetCheckData" class="mr-2"> 设置勾选数据 </a-button>
      <a-button @click="handleGetCheckData" class="mr-2"> 获取勾选数据 </a-button>
      <a-button @click="handleSetSelectData" class="mr-2"> 设置选中数据 </a-button>
      <a-button @click="handleGetSelectData" class="mr-2"> 获取选中数据 </a-button>

      <a-button @click="handleSetExpandData" class="mr-2"> 设置展开数据 </a-button>
      <a-button @click="handleGetExpandData" class="mr-2"> 获取展开数据 </a-button>
    </div>
    <div class="mb-4">
      <a-button @click="appendNodeByKey(null)" class="mr-2"> 添加根节点 </a-button>
      <a-button @click="appendNodeByKey('2-2')" class="mr-2"> 添加在parent3内添加节点 </a-button>
      <a-button @click="deleteNodeByKey('2-2')" class="mr-2"> 删除parent3节点 </a-button>
      <a-button @click="updateNodeByKey('1-1')" class="mr-2"> 更新parent2节点 </a-button>
    </div>
    <CollapseContainer title="函数操作" class="mr-4" :canExpan="false" :style="{ width: '33%' }">
      <BasicTree :treeData="treeData" ref="treeRef" :checkable="true" />
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicTree, TreeActionType } from '/@/components/Tree/index';
  import { treeData } from './data';
  import { CollapseContainer } from '/@/components/Container/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: { BasicTree, CollapseContainer, PageWrapper },
    setup() {
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const { createMessage } = useMessage();

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

      function handleSetExpandData() {
        getTree().setExpandedKeys(['0-0']);
      }

      function handleGetExpandData() {
        const keys = getTree().getExpandedKeys();
        createMessage.success(JSON.stringify(keys));
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

      return {
        treeData,
        treeRef,
        handleLevel,
        handleSetCheckData,
        handleGetCheckData,
        handleSetSelectData,
        handleGetSelectData,
        handleSetExpandData,
        handleGetExpandData,
        appendNodeByKey,
        deleteNodeByKey,
        updateNodeByKey,
      };
    },
  });
</script>
