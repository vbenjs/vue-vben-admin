<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup name="DeptModal">
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './dept.data';
  import { getDeptList, createDept, updateDept } from '/@/api/system/dept';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const rowId = ref<number>(0);

  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      rowId.value = data.record.id;

      setFieldsValue({
        ...data.record,
        parentId: data.record.parent?.id,
      });
    }

    const treeData = await getDeptList();
    updateSchema({
      field: 'parentId',
      componentProps: { treeData },
    });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });

      if (!values.parentId) {
        values.parentId = -1;
      }

      if (!unref(isUpdate)) {
        await createDept(values);
      } else {
        await updateDept(rowId.value, values);
      }

      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
