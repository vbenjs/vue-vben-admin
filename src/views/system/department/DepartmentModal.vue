<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { listDepartmentTree, createDepartment, updateDepartment } from '/@/apis/departments';
  import { formSchema } from './department.data';
  const isUpdate = ref(true);
  const id = ref<string | null>(null);
  const getTitle = computed(() => (!unref(isUpdate) ? '新增部门' : '编辑部门'));
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
      id.value = data.record.id;
      setFieldsValue({
        ...data.record,
      });
    }
    const treeData = await listDepartmentTree();
    updateSchema({
      field: 'parentId',
      componentProps: { treeData },
    });
  });
  const emit = defineEmits(['success', 'register']);
  async function handleSubmit() {
    try {
      const values = await validate();
      const department = {
        ...values,
        parent: { id: values.parentId },
      };
      setModalProps({ confirmLoading: true });
      if (unref(isUpdate)) {
        await updateDepartment(unref(id)!, department);
      } else {
        await createDepartment(department);
      }
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
<template>
  <basic-modal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <basic-form @register="registerForm" />
  </basic-modal>
</template>
