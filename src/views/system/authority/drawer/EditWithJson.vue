<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    title="JSON编辑"
    @ok="handleSubmit"
    :width="640"
    destroyOnClose
    showFooter
  >
    <CodeEditor v-model:value="value" :mode="MODE.JSON" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { message } from 'ant-design-vue';
  import { CodeEditor, MODE } from '@/components/CodeEditor';
  import {
    getActionById,
    getPermissionById,
    saveAction,
    savePermission,
  } from '@/api/system/permission';

  const rowId = ref<number>();
  const value = ref();
  const emit = defineEmits(['success', 'register']);
  const props = defineProps({
    type: {
      type: String as PropType<'permission' | 'action'>,
      default: 'permission',
    },
  });
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    setDrawerProps({ confirmLoading: false });
    rowId.value = data;
    let res;
    switch (props.type) {
      case 'permission':
        res = await getPermissionById(data);
        break;
      case 'action':
        res = await getActionById(data);
        break;
    }
    value.value = JSON.stringify(res);
  });

  async function handleSubmit() {
    try {
      const jsonData = JSON.parse(unref(value));
      switch (props.type) {
        case 'permission':
          await savePermission(jsonData);
          break;
        case 'action':
          await saveAction(jsonData);
          break;
      }
      closeDrawer();
      message.success('保存成功！');
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
