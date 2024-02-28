<template>
  <UpdateContent
    :update-api="updateBillInRule"
    :get-makedown="getPdaMakedown"
    update-field="note"
  />
</template>
<script lang="ts" setup>
  import { updateBillInRule } from '@/api/configuration/pda';
  import { getPdaMakedown } from '@/api/others/barRule';

  import UpdateContent from '@/views/configuration/components/UpdateContent.vue';
  defineOptions({ name: 'UpdateBillInRule' });
</script>
