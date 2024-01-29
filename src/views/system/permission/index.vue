<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <RoleTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <MenuTree class="w-3/4 xl:2-4/5" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';

  import RoleTree from './RoleTree.vue';
  import MenuTree from './MenuTree.vue';

  defineOptions({ name: 'AccountManagement' });

  const handleSelect = (roleId: string) => {
    console.log('======role', roleId);
  };
</script>
