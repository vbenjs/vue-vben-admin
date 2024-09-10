<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter';

defineOptions({
  name: 'FormModelDemo',
});

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
});
const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    await formApi.submitForm();
    drawerApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { onSubmit, schema, values } =
        drawerApi.getData<Record<string, any>>();
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
  <Drawer>
    <Form />
  </Drawer>
</template>
