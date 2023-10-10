<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './template.data';
  import { createTemplate, updateTemplate } from '/@/apis/templates';

  const isUpdate = ref(false);
  const id = ref<number | null>(null);
  const groupId = ref<Nullable<number>>(null);
  const getTitle = computed(() => (!unref(isUpdate) ? '新增模板' : '编辑模板'));
  const [registerForm, { setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: formSchema,
    showActionButtonGroup: false,
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false, defaultFullscreen: true });
    isUpdate.value = !!data?.isUpdate;
    groupId.value = data.groupId;
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
      // TODO custom api
      if (unref(isUpdate)) {
        await updateTemplate(unref(id)!, values);
      } else {
        await createTemplate({ ...values, groupId: unref(groupId) });
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
