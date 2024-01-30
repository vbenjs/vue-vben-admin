<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <RoleTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <MenuTree
      class="w-3/4 xl:2-4/5"
      :selected-role-id="selectedRoleId"
      :checked-codes="checkedCodes"
    />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';

  import { PageWrapper } from '@/components/Page';
  import { getPermCodeByRole } from '@/api/account';

  import RoleTree from './RoleTree.vue';
  import MenuTree from './MenuTree.vue';

  defineOptions({ name: 'PermissionManagement' });

  const selectedRoleId = ref<string>();
  const checkedCodes = ref<string[]>([]);

  const handleSelect = async (roleId: string) => {
    selectedRoleId.value = roleId;
    checkedCodes.value = await getPermCodeByRole(roleId);
  };
</script>
