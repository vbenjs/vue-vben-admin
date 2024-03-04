<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';

  import { BasicForm, useForm } from '@/components/Form';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useMessage } from '@/hooks/web/useMessage';
  import { getMenuList, saveMenu } from '@/api/menu';

  import { formSchema } from './menu.data';
  import { MenuListItem } from '@/api/menu/model/menuModel';

  defineOptions({ name: 'MenuDrawer' });

  const emit = defineEmits(['success', 'register']);
  const { hasPermission } = usePermission();
  const { createMessage } = useMessage();

  const isUpdate = ref(true);
  const recordId = ref<string>();

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

    setFieldsValue({
      ...data.record,
    });
    if (unref(isUpdate)) {
      recordId.value = data.record.id;
    }
    const treeData = await getMenuList();
    updateSchema({
      field: 'parentMenuId',
      componentProps: { treeData },
    });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

  async function handleSubmit() {
    const permKey = unref(isUpdate) ? 'sys:menu:update' : 'sys:menu:add';
    if (!hasPermission(permKey)) {
      createMessage.error('无权操作');
      return;
    }
    try {
      const values = await validate();
      setDrawerProps({ confirmLoading: true });
      await saveMenu(values as MenuListItem, recordId.value);
      console.log(values);
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
