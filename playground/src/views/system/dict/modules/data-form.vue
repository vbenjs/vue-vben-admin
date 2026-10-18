<script lang="ts" setup>
import type { SystemDictApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useDictStore } from '@vben/stores';

import { useVbenForm } from '#/adapter/form';
import { createDictData, updateDictData } from '#/api';
import { $t } from '#/locales';

import { useDataFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();
const dictStore = useDictStore();
const formData = ref<SystemDictApi.SystemDictData>();
type DictDataModalData =
  | Pick<SystemDictApi.SystemDictData, 'dictCode'>
  | SystemDictApi.SystemDictData;

const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.dict.label')])
    : $t('ui.actionTitle.create', [$t('system.dict.label')]);
});

const [Form, formApi] = useVbenForm({
  commonConfig: { labelWidth: 'auto' },
  schema: useDataFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal<DictDataModalData>({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const values = (await formApi.getValues()) as Omit<
      SystemDictApi.SystemDictData,
      'createTime' | 'id'
    >;
    try {
      await (formData.value?.id
        ? updateDictData(formData.value.id, values)
        : createDictData(values));
      dictStore.refreshDict(values.dictCode);
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
        formData.value = 'id' in data ? data : undefined;
        formApi.setValues(data);
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
