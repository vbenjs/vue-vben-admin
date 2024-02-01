<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form';
import { accountFormSchema } from '@/views/demo/system/account/account.data';
import { useTrackTableRowContext } from '@/components/Table';
import { computed, unref } from 'vue';

defineOptions({ name: 'AccountModal' });

const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
  labelWidth: 100,
  baseColProps: { span: 24 },
  schemas: accountFormSchema,
  showActionButtonGroup: false,
  actionColOptions: {
    span: 23,
  },
});

const { row } = useTrackTableRowContext()
const getTitle = computed(() => `${unref(row) ? '编辑' : '新增'}账号`)

const [registerModal, { setModalProps, closeModal }] = useModalInner(() => {
  resetFields();
  setModalProps({ confirmLoading: false });
  setFieldsValue(unref(row) ?? {})
});

async function handleSubmit() {
  try {
    const values = await validate();
    setModalProps({ confirmLoading: true });
    // TODO custom api
    console.log(values);
    closeModal();
  } finally {
    setModalProps({ confirmLoading: false });
  }
}
</script>
