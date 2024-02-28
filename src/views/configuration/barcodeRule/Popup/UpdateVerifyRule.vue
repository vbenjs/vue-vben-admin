<template>
  <UpdateContent
    :update-api="updateBarcodeVerifyRule"
    :get-makedown="getBarVerifyMakedown"
    update-field="verify"
  />
</template>
<script lang="ts" setup>
  import { updateBarcodeVerifyRule } from '@/api/configuration/barcodeRule';

  import { getBarVerifyMakedown } from '@/api/others/barRule';

  import UpdateContent from '@/views/configuration/components/UpdateContent.vue';

  defineOptions({ name: 'UpdateVerifyRule' });
</script>
