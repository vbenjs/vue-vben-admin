<template>
  <UpdateContent :update-api="updateBarcodeRuleContent" :get-makedown="getBarRuleMakedown" />
</template>
<script lang="ts" setup>
  import { updateBarcodeRuleContent } from '@/api/configuration/barcodeRule';
  import { getBarRuleMakedown } from '@/api/others/barRule';

  import UpdateContent from '@/views/configuration/components/UpdateContent.vue';

  defineOptions({ name: 'UpdateBarcodeRule' });
</script>
