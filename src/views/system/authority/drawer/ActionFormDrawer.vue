<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    @ok="handleSubmit"
    :width="640"
    destroyOnClose
    showFooter
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, toRaw } from 'vue';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { ActionKey } from '../form';
  import { saveAction } from '@/api/system/permission';
  import { message } from 'ant-design-vue';
  import { YN } from '@/enums/YN';

  const actionKey = ref<ActionKey>();
  const rowId = ref<number>();
  const emit = defineEmits(['success', 'register']);

  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 90,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
    schemas: [
      {
        field: 'permissionId',
        label: '',
        component: 'Input',
        show: false,
      },
      {
        field: 'actionName',
        label: '操作名称',
        component: 'Input',
        rules: [{ required: true, message: '请填写操作名称' }],
        colProps: { span: 24 },
      },

      {
        field: 'actionCode',
        label: '操作编码',
        component: 'Input',
        rules: [
          { required: true, message: '请填写操作编码' },
          { pattern: /^[0-9a-zA-Z_]{1,}$/, message: '支持字母、数字、下划线' },
        ],
        colProps: { span: 24 },
      },
      {
        field: 'defaultCheck',
        label: '默认选中',
        component: 'Checkbox',
        colProps: { span: 24 },
      },
      {
        field: 'sortNum',
        label: '排序',
        component: 'InputNumber',
        defaultValue: 0,
        colProps: { span: 24 },
      },
      {
        field: 'requestList',
        label: '请求集合',
        component: 'InputTextArea',
        componentProps: {
          autoSize: { minRows: 4 },
          placeholder: '每行1条',
        },
        rules: [{ required: true, message: '请至少输入一个请求' }],
        colProps: { span: 24 },
      },
    ],
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    actionKey.value = data?.actionKey;

    resetFields();
    setDrawerProps({ confirmLoading: false });
    const actionData = toRaw(data.record);
    actionData.requestList = actionData?.requestList?.join('\n');
    rowId.value = actionData.id;
    setFieldsValue({
      ...actionData,
      defaultCheck: actionData.defaultCheck === YN.Y,
    });
  });

  const getTitle = computed(() => {
    const action = unref(actionKey);
    if (action === 'create') return '新建操作';
    if (action === 'edit') return '编辑操作';
    return '';
  });
  async function handleSubmit() {
    try {
      const values = await validate();
      values.defaultCheck = values.defaultCheck ? YN.Y : YN.N;
      values.requestList = values.requestList?.split('\n');
      values.id = unref(rowId);
      await saveAction(values);
      message.success('保存成功！');
      closeDrawer();
      emit('success', {
        actionKey: unref(actionKey),
        values: { ...values, id: rowId.value },
      });
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
