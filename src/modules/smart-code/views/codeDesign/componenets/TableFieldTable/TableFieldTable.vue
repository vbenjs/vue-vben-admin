<template>
  <div>
    <SmartTable v-bind="$attrs" @register="register" :size="tableSizeConfig" />
  </div>
</template>

<script lang="ts" setup>
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { SmartTable, useSmartTable } from '@/components/SmartTable';

  import { getTableFiledColumns } from '../../CodeDesignPage.config';

  const { tableSizeConfig } = useSizeSetting();

  const [register] = useSmartTable({
    columns: getTableFiledColumns(),
    border: true,
    align: 'center',
    stripe: true,
    rowConfig: {
      isHover: true,
    },
  });
</script>

<style scoped></style>
