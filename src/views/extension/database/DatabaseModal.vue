<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';

  import { useMessage } from '/@/hooks/web/useMessage';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';

  import { createDatabase, updateDatabase, connectDatabase } from '/@/apis/databases';

  import { formSchema } from './database.data';

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

  const connectLoading = ref(false);
  const { createMessage } = useMessage();
  async function handleConnect() {
    try {
      connectLoading.value = true;
      const res = await connectDatabase(await validate());
      if (res) {
        createMessage.success('连接成功');
      } else {
        createMessage.error('连接失败');
      }
    } finally {
      connectLoading.value = false;
    }
  }
</script>
<template>
  <basic-modal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <basic-form @register="registerForm" />
    <template #centerFooter>
      <a-button type="success" danger @click="handleConnect" :loading="connectLoading">
        测试连接
      </a-button>
    </template>
  </basic-modal>
</template>
