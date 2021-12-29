<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('component.excel.exportModalTitle')"
    @ok="handleOk"
    @register="registerModal"
  >
    <BasicForm
      :labelWidth="100"
      :schemas="schemas"
      :showActionButtonGroup="false"
      @register="registerForm"
    />
  </BasicModal>
</template>
<script lang="ts">
  import type { ExportModalResult } from './typing';
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';

  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const schemas: FormSchema[] = [
    {
      field: 'filename',
      component: 'Input',
      label: t('component.excel.fileName'),
      rules: [{ required: true }],
    },
    {
      field: 'bookType',
      component: 'Select',
      label: t('component.excel.fileType'),
      defaultValue: 'xlsx',
      rules: [{ required: true }],
      componentProps: {
        options: [
          {
            label: 'xlsx',
            value: 'xlsx',
            key: 'xlsx',
          },
          {
            label: 'html',
            value: 'html',
            key: 'html',
          },
          {
            label: 'csv',
            value: 'csv',
            key: 'csv',
          },
          {
            label: 'txt',
            value: 'txt',
            key: 'txt',
          },
        ],
      },
    },
  ];
  export default defineComponent({
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const [registerForm, { validateFields }] = useForm();
      const [registerModal, { closeModal }] = useModalInner();

      async function handleOk() {
        const res = (await validateFields()) as ExportModalResult;
        const { filename, bookType } = res;
        emit('success', {
          filename: `${filename.split('.').shift()}.${bookType}`,
          bookType,
        });
        closeModal();
      }

      return {
        schemas,
        handleOk,
        registerForm,
        registerModal,
        t,
      };
    },
  });
</script>
