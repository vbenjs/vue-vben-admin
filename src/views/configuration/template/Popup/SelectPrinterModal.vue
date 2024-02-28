<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="'选择打印机'"
    @ok="handleSubmit"
    :width="400"
    :minHeight="40"
    destroyOnClose
    :canFullscreen="false"
  >
    <div class="mx-1">
      <BasicForm @register="registerForm" validateTrigger="blur" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { useForm, BasicForm } from '@/components/Form';
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { getPrinter } from '@/api/configuration/printer';
  // import { testPrintTemplate } from '@/api/configuration/printTemplate';
  import { ref } from 'vue';

  const emit = defineEmits(['success', 'register']);

  const getData = ref();

  const [registerForm, { validate }] = useForm({
    // layout: 'vertical',
    // labelWidth: 100,
    rowProps: {
      gutter: [12, 8],
    },
    compact: true,
    showActionButtonGroup: false,
    schemas: [
      {
        field: 'printer',
        component: 'ApiSelect',
        label: '打印机',
        componentProps: {
          api: getPrinter,
          valueField: 'id',
          labelField: 'name',
        },
        required: true,
        colProps: { span: 24 },
      },
    ],
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false });
    getData.value = data;
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      emit('success', { ...getData.value, printerId: values.printer });
      // await testPrintTemplate(values.printer, rowId.value);
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
