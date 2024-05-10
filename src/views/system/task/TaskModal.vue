<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getTaskInfo, taskAdd, taskUpdate } from '/@/api/system/task';
  import { formSchema } from './task.data';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const rowId = ref<number>(0);
  const getTitle = computed(() => (!unref(isUpdate) ? '新增任务' : '编辑任务'));

  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      rowId.value = data.record.id;
      const taskInfo = await getTaskInfo(data.record.id);
      setFieldsValue({
        ...data.record,
        ...taskInfo,
      });
    }
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });

      if (!unref(isUpdate)) {
        await taskAdd(values);
      } else {
        await taskUpdate(rowId.value, values);
      }

      closeModal();
      emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
