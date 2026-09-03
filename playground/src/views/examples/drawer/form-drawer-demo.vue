<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';

defineOptions({
  name: 'FormDrawerDemo',
});

interface FormDrawerData {
  values?: Record<string, unknown>;
}

const [Form, formApi] = useVbenForm({
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'field1',
      label: '字段1',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'field2',
      label: '字段2',
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});
const [Drawer, drawerApi] = useVbenDrawer<FormDrawerData>({
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    await formApi.submit();
    drawerApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = drawerApi.getData();
      if (data?.values) {
        formApi.setValues(data.values);
      } else {
        formApi.reset();
      }
    }
  },
  title: '内嵌表单示例',
});

defineExpose({ drawerApi });
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
