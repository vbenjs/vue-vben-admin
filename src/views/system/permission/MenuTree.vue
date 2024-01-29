<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      :treeData="treeData"
      :fieldNames="{ title: 'menuName', key: 'id' }"
      checkable
      toolbar
      emptyDesc="请在左侧选择要修改权限的角色"
      title="菜单分配"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';

  import { BasicTree, TreeItem } from '@/components/Tree';
  import { getMenuList } from '@/api/menu';

  const treeData = ref<TreeItem[]>([]);

  const fetchMenuList = async () => {
    const list = await getMenuList();
    console.log('=============list', list);
    treeData.value = list as unknown as TreeItem[];
  };

  fetchMenuList();
  const handleSelect = (selected: string) => {
    console.log('=======select=====', selected);
  };
</script>
