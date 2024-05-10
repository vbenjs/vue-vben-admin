<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="40%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './menu.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { getMenuList, createMenu, updateMenu, MenuParams } from '/@/api/system/menu';

  const emit = defineEmits(['success', 'register']);

  const rowId = ref<number>(0);
  const isUpdate = ref(true);

  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    const treeData = await getMenuList();
    updateSchema({
      field: 'parent',
      componentProps: { treeData },
    });

    if (unref(isUpdate)) {
      rowId.value = data.record.id;

      setFieldsValue({
        ...data.record,
      });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

  async function handleSubmit() {
    try {
      const values = await validate();
      setDrawerProps({ confirmLoading: true });

      if (!unref(isUpdate)) {
        await createMenu(values as MenuParams);
      } else {
        await updateMenu(rowId.value, values);
      }

      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
