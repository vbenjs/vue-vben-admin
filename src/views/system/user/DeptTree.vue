<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      title="组织架构"
      toolbar
      search
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto"
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames="{ key: 'id', title: 'name' }"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts" setup name="DeptTree">
  import { onMounted, ref } from 'vue';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { getDeptList } from '/@/api/system/dept';

  const emit = defineEmits(['select']);

  const treeData = ref<TreeItem[]>([]);

  async function fetch() {
    treeData.value = (await getDeptList()) as unknown as TreeItem[];
  }

  function handleSelect(keys) {
    emit('select', keys[0]);
  }

  onMounted(() => {
    fetch();
  });
</script>
