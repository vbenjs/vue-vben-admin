<script lang="ts" setup>
import type { SystemDictApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useDictStore } from '@vben/stores';

import { useVbenForm } from '#/adapter/form';
import { createDictType, updateDictType } from '#/api';
import { $t } from '#/locales';

import { useTypeFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();
const dictStore = useDictStore();
const formData = ref<SystemDictApi.SystemDictType>();

const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.dict.name')])
    : $t('ui.actionTitle.create', [$t('system.dict.name')]);
});

const [Form, formApi] = useVbenForm({
  commonConfig: { labelWidth: 'auto' },
  schema: useTypeFormSchema(() => formData.value?.id),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal<null | SystemDictApi.SystemDictType>({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const values = (await formApi.getValues()) as Omit<
      SystemDictApi.SystemDictType,
      'createTime' | 'id'
    >;
    try {
      const oldCode = formData.value?.code;
      await (formData.value?.id
        ? updateDictType(formData.value.id, values)
        : createDictType(values));
      if (oldCode) {
        dictStore.refreshDict(oldCode);
        if (values.code !== oldCode) {
          dictStore.refreshDict(values.code);
        }
      }
      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData();
      if (data) {
        formData.value = data;
        formApi.setValues(data);
      } else {
        formData.value = undefined;
        formApi.reset();
      }
    }
  },
});

defineExpose({ modalApi });
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
