<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter';

defineOptions({
  name: 'FormModelDemo',
});

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
});
const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.submitForm();
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { onSubmit, schema, values } =
        modalApi.getData<Record<string, any>>();
      if (schema) {
        formApi.setState((prev) => {
          return {
            ...prev,
            schema,
          };
        });
      }
      if (onSubmit) {
        formApi.setState((prev) => {
          return {
            ...prev,
            handleSubmit: async (values) => {
              await onSubmit?.(values);
            },
          };
        });
      }
      if (values) {
        formApi.setValues(values);
      }
    }
  },
});
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>
