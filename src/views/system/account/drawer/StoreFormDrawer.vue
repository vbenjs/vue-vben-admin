<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    @ok="handleSubmit"
    :width="578"
    destroyOnClose
    showFooter
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { message } from 'ant-design-vue';
  import { useForm, BasicForm } from '@/components/Form';
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';
  import { batchCreateUserStore, createUserStore } from '@/api/userStore';
  import { getStore } from '@/api/store';
  import { userStoreTypeOptions } from '@/enums/userStoreType';

  const accountId = ref(0);
  const emit = defineEmits(['success', 'register']);
  const [registerForm, { validate, resetFields }] = useForm({
    layout: 'vertical',
    showActionButtonGroup: false,
    schemas: [
      {
        field: 'storeType',
        label: '权限类型',
        component: 'Select',
        componentProps: {
          options: userStoreTypeOptions,
        },
        colProps: { span: 24 },
      },
      {
        field: 'storeIds',
        label: '地点',
        component: 'ApiSelect',
        componentProps: () => {
          return {
            api: getStore,
            showSearch: true,
            filterOption: false,
            mode: 'multiple',
            maxTagCount: 2,
            labelField: 'name',
            valueField: 'id',
            searchField: 'storeInfo',
          };
        },
        dynamicRules: () => {
          return [{ required: true, trigger: 'blur', message: '请选择地点' }];
        },
        colProps: { span: 24 },
        ifShow: ({ model }) => model.storeType === 'STORE',
      },
      {
        field: 'mark',
        label: '备注',
        component: 'InputTextArea',
        componentProps: {
          autoSize: { minRows: 6 },
          placeholder: '请输入备注',
        },
        colProps: { span: 24 },
      },
    ],
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    accountId.value = data;
  });

  const getTitle = computed(() => {
    return '添加地点';
  });
  async function handleSubmit() {
    try {
      const values = await validate();
      setDrawerProps({ confirmLoading: true });
      if (values.storeType === 'ALL') {
        await createUserStore({ ...values, accountId: accountId.value });
      } else {
        delete values.storeType;
        await batchCreateUserStore({ ...values, accountId: accountId.value });
      }
      message.success('添加成功！');
      closeDrawer();
      emit('success', { action: 'edit', values: { ...values } });
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
