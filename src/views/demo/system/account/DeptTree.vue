<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      :title="t('sys.dept.name')"
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
  import { getDeptList } from '@/api/demo/system';
  import { useI18n } from '@/hooks/web/useI18n';

  defineOptions({ name: 'DeptTree' });

  const emit = defineEmits(['select']);

  const treeData = ref<TreeItem[]>([]);
  const { t } = useI18n();
  async function fetch() {
    treeData.value = (await getDeptList()) as unknown as TreeItem[];
  }

  function handleSelect(keys) {
    console.log(keys);
    emit('select', keys[0]);
  }

  onMounted(() => {
    fetch();
  });
</script>
