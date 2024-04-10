<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('layout.header.changeTenant')"
    @register="registerModal"
    @open-change="handleOpenChange"
    @ok="handleOk"
  >
    <BasicForm @register="registerForm">
      <template #tenant="{ model, field }">
        <RadioGroup v-model:value="model[field]">
          <Radio v-for="item in tenantListRef" :key="item.id" :value="item.id" :style="radioStyle">
            {{ item.tenantCode }}: {{ item.tenantShortName || item.tenantName }}
          </Radio>
        </RadioGroup>
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { nextTick, ref, unref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { Radio } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import { BasicForm, useForm } from '@/components/Form';
  import { useUserStore } from '@/store/modules/user';

  import { listCurrentUserTenantApi } from '@/api/sys/user';
  import { successMessage } from '@/utils/message/SystemNotice';

  const RadioGroup = Radio.Group;

  const { t } = useI18n();
  const userStore = useUserStore();
  const { changeTenant } = userStore;
  const { getUserTenant } = storeToRefs(userStore);

  const tenantListRef = ref<Recordable[]>();
  const handleOpenChange = async (visible: boolean) => {
    if (visible) {
      nextTick(() => {
        setFieldsValue({
          tenantId: unref(getUserTenant)?.tenantId,
        });
      });
      try {
        changeLoading(true);
        tenantListRef.value = await listCurrentUserTenantApi();
      } finally {
        changeLoading(false);
      }
    } else {
      tenantListRef.value = [];
    }
  };

  const handleOk = async () => {
    const { tenantId } = await validate();
    if (tenantId === unref(getUserTenant)?.tenantId) {
      closeModal();
      return false;
    }
    try {
      changeOkLoading(true);
      await changeTenant(tenantId);
      successMessage(t('layout.header.changeTenantSuccess'));
      closeModal();
    } finally {
      changeOkLoading(false);
    }
  };

  const [registerModal, { changeLoading, closeModal, changeOkLoading }] = useModalInner();
  const [registerForm, { setFieldsValue, validate }] = useForm({
    showActionButtonGroup: false,
    schemas: [
      {
        field: 'tenantId',
        label: t('layout.header.changeTenant'),
        slot: 'tenant',
        required: true,
      },
    ],
  });

  const radioStyle = ref({
    display: 'flex',
    height: '30px',
    lineHeight: '30px',
  });
</script>

<style scoped lang="less"></style>
