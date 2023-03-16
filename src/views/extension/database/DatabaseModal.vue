<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './database.data';
  import { createDatabase, updateDatabase } from '/@/apis/databases';
  const isUpdate = ref(false);
  const id = ref<number | null>(null);
  const getTitle = computed(() => (!unref(isUpdate) ? '新增数据库' : '编辑数据库'));
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
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
  });
  const emit = defineEmits(['success', 'register']);
  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      if (unref(isUpdate)) {
        await updateDatabase(unref(id)!, values);
      } else {
        await createDatabase(values);
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
