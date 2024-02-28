<template>
  <UpdateContent :update-api="updateBoxRule" :get-makedown="getPdaMakedown" update-field="note" />
</template>
<script lang="ts" setup>
  import { updateBoxRule } from '@/api/configuration/pda';
  import { getPdaMakedown } from '@/api/others/barRule';

  import UpdateContent from '@/views/configuration/components/UpdateContent.vue';

  defineOptions({ name: 'UpdateBoxRule' });
</script>
