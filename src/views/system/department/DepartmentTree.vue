<script lang="ts" setup>
  import { ref, onBeforeMount } from 'vue';

  import { BasicTree, TreeItem } from '/@/components/Tree';

  import TreeNode from '/@/apis/TreeNode';
  import { listDepartmentTree } from '/@/apis/departments';

  const treeData = ref<TreeItem[]>([]);

  async function fetch() {
    treeData.value = treeNode2TreeData(await listDepartmentTree());
  }

  function treeNode2TreeData(treeNodes: TreeNode[]): TreeItem[] {
    const result: TreeItem[] = [];
    treeNodes.forEach((node) => {
      const temp: TreeItem = { key: node.id, title: node.name };
      if (node.children) {
        temp.children = treeNode2TreeData(node.children);
      }
      result.push(temp);
    });
    return result;
  }

  onBeforeMount(() => {
    fetch();
  });
</script>
<template>
  <!-- <div class="m-4 mr-0 overflow-hidden bg-white"> -->
  <basic-tree title="部门列表" :tree-data="treeData" />
  <!-- </div> -->
</template>
