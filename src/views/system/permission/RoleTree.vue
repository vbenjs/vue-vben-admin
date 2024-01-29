<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      title="角色列表"
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
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  import { BasicTree, TreeItem } from '@/components/Tree';
  import { getRoleListByPage } from '@/api/account/role';

  defineOptions({ name: 'RoleTree' });

  const emit = defineEmits(['select']);

  const treeData = ref<TreeItem[]>([]);

  async function fetch() {
    const list = (await getRoleListByPage({ isAll: true })).list;
    treeData.value = list as unknown as TreeItem[];
  }

  function handleSelect(keys: string[]) {
    emit('select', keys[0]);
  }

  onMounted(() => {
    fetch();
  });
</script>
