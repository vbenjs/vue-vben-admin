<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './dictionary-item.data';
  import { createDictionaryItem, updateDictionaryItem } from '/@/apis/dictionary-items';
  const isUpdate = ref(false);
  const id = ref<string | null>(null);
  const dictionaryId = ref<Nullable<string>>(null);
  const getTitle = computed(() => (!unref(isUpdate) ? '新增字典项' : '编辑字典项'));
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
    dictionaryId.value = data.dictionaryId;
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
        await updateDictionaryItem(unref(id)!, values);
      } else {
        await createDictionaryItem({ ...values, dictionaryId: unref(dictionaryId) });
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
