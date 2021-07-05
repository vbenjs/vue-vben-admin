<template>
  <PageWrapper title="Tree基础示例">
    <div class="flex">
      <BasicTree
        :treeData="treeData"
        title="基础示例，默认展开第一层"
        defaultExpandLevel="1"
        class="w-1/3"
      />

      <BasicTree
        :treeData="treeData"
        title="可勾选，默认全部展开"
        :checkable="true"
        class="w-1/3 mx-4"
        defaultExpandAll
        @check="handleCheck"
      />

      <BasicTree
        title="指定默认展开/勾选示例"
        :treeData="treeData"
        :checkable="true"
        :expandedKeys="['0-0']"
        :checkedKeys="['0-0']"
        class="w-1/3"
      />
    </div>
    <div class="flex">
      <BasicTree
        title="异步树"
        ref="asyncTreeRef"
        :treeData="tree"
        class="w-1/3"
        :load-data="onLoadData"
      />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicTree, TreeActionType } from '/@/components/Tree/index';
  import { treeData } from './data';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: { BasicTree, PageWrapper },
    setup() {
      const asyncTreeRef = ref<Nullable<TreeActionType>>(null);
      function handleCheck(checkedKeys, e) {
        console.log('onChecked', checkedKeys, e);
      }
      const tree = ref([
        {
          title: 'parent ',
          key: '0-0',
        },
      ]);

      function onLoadData(treeNode) {
        return new Promise((resolve: (value?: unknown) => void) => {
          if (!treeNode.children) {
            resolve();
            return;
          }
          setTimeout(() => {
            const asyncTreeAction: TreeActionType | null = unref(asyncTreeRef);
            if (asyncTreeAction) {
              const nodeChildren = [
                { title: `Child Node ${treeNode.eventKey}-0`, key: `${treeNode.eventKey}-0` },
                { title: `Child Node ${treeNode.eventKey}-1`, key: `${treeNode.eventKey}-1` },
              ];
              asyncTreeAction.updateNodeByKey(treeNode.eventKey, { children: nodeChildren });
              asyncTreeAction.setExpandedKeys([
                treeNode.eventKey,
                ...asyncTreeAction.getExpandedKeys(),
              ]);
            }

            resolve();
            return;
          }, 1000);
        });
      }
      return { treeData, handleCheck, tree, onLoadData, asyncTreeRef };
    },
  });
</script>
