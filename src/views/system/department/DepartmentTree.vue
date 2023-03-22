<script lang="ts" setup>
  import { ref, onBeforeMount } from 'vue';

  import { BasicTree, TreeItem } from '/@/components/Tree';

  import { listDepartmentTree } from '/@/apis/departments';

  import { treeNode2TreeData } from '../helpers';

  const treeData = ref<TreeItem[]>([]);

  async function fetch() {
    treeData.value = treeNode2TreeData(await listDepartmentTree());
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
