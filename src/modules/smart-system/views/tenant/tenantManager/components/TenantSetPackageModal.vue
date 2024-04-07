<template>
  <BasicModal @register="registerModal" :title="t('system.views.tenant.manager.title.setPackage')">
    <div></div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { ref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';

  const { t } = useI18n();

  const tenantIdRef = ref<number | null>(null);

  const [registerModal] = useModalInner(({ tenantId }) => {
    tenantIdRef.value = tenantId;
  });
</script>

<style lang="less"></style>
