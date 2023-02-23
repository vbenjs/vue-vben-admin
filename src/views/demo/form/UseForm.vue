<template>
  <PageWrapper title="UseForm操作示例">
    <Space class="mb-4">
      <a-button type="primary" @click="showDrawer"> 更改设置 </a-button>
      <a-button @click="setProps({ resetButtonOptions: { disabled: true, text: '重置New' } })">
        修改重置按钮
      </a-button>
      <a-button @click="setProps({ submitButtonOptions: { disabled: true, loading: true } })">
        修改查询按钮
      </a-button>
      <a-button @click="handleLoad" class="mr-2"> 联动回显 </a-button>
    </Space>

    <Drawer v-model:visible="visible" title="更改设置" placement="right">
      <BasicForm ref="settingFormRef" @register="registerSetting" @submit="handleSubmitSetting" />
      <template #extra>
        <Space>
          <a-button @click="resetSettings">重置设置</a-button>
          <a-button type="primary" @click="onSettings">应用</a-button>
        </Space>
      </template>
    </Drawer>

    <CollapseContainer title="useForm示例">
      <BasicForm @register="register" @submit="handleSubmit" />
    </CollapseContainer>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Drawer, Space } from 'ant-design-vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { CollapseContainer } from '/@/components/Container';
  import { PageWrapper } from '/@/components/Page';
  import { areaRecord } from '/@/api/demo/cascader';

  const sizeList = [
    { value: 'large', label: 'large' },
    { value: 'middle', label: 'middle' },
    { value: 'small', label: 'small' },
    { value: 'default', label: 'defualt' },
  ];

  const schemas: FormSchema[] = [
    {
      field: 'field1',
      component: 'Input',
      label: '字段1',
      colProps: { span: 8 },
      componentProps: {
        placeholder: '自定义placeholder',
        onChange: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'field2',
      component: 'Input',
      label: '字段2',
      colProps: { span: 8 },
    },
    {
      field: 'field3',
      component: 'DatePicker',
      label: '字段3',
      colProps: { span: 8 },
    },
    {
      field: 'fieldTime',
      component: 'RangePicker',
      label: '时间字段',
      colProps: { span: 8 },
    },
    {
      field: 'field4',
      component: 'Select',
      label: '字段4',
      colProps: { span: 8 },
      componentProps: {
        options: [
          { label: '选项1', value: '1', key: '1' },
          { label: '选项2', value: '2', key: '2' },
        ],
      },
    },
    {
      field: 'field5',
      component: 'CheckboxGroup',
      label: '字段5',
      colProps: {
        span: 8,
      },
      componentProps: {
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
        ],
      },
    },
    {
      field: 'field7',
      component: 'RadioGroup',
      label: '字段7',
      colProps: { span: 8 },
      componentProps: {
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
        ],
      },
    },
    {
      field: 'field8',
      component: 'ApiCascader',
      label: '联动',
      colProps: { span: 8 },
      componentProps: {
        api: areaRecord,
        apiParamKey: 'parentCode',
        dataField: 'data',
        labelField: 'name',
        valueField: 'code',
        initFetchParams: {
          parentCode: '',
        },
        isLeaf: (record) => {
          return !(record.levelType < 3);
        },
      },
    },
    {
      field: 'field9',
      component: 'ApiCascader',
      label: '联动回显',
      colProps: { span: 8 },
      componentProps: {
        api: areaRecord,
        apiParamKey: 'parentCode',
        dataField: 'data',
        labelField: 'name',
        valueField: 'code',
        initFetchParams: {
          parentCode: '',
        },
        isLeaf: (record) => {
          return !(record.levelType < 3);
        },
      },
    },
  ];

  const formSchemas: FormSchema[] = [
    {
      field: '',
      component: 'Divider',
      label: '基础属性',
      colProps: { span: 24 },
      componentProps: {
        orientation: 'center',
      },
    },
    {
      field: 'labelWidth',
      defaultValue: 120,
      component: 'InputNumber',
      label: 'labelWidth',
      colProps: { span: 24 },
      componentProps: {
        size: 'small',
      },
    },
    {
      field: 'size',
      defaultValue: 'default',
      component: 'Select',
      label: 'size',
      colProps: { span: 24 },
      componentProps: {
        options: sizeList,
        size: 'small',
      },
    },
    {
      field: 'disabled',
      defaultValue: false,
      component: 'Switch',
      label: 'disabled',
      colProps: { span: 24 },
      componentProps: {
        size: 'small',
      },
    },
    {
      field: 'compact',
      defaultValue: false,
      component: 'Switch',
      label: 'compact',
      colProps: { span: 24 },
      componentProps: {
        size: 'small',
      },
    },
    {
      field: '',
      component: 'Divider',
      label: '网格布局',
      colProps: { span: 24 },
      componentProps: {
        orientation: 'center',
      },
    },
    {
      field: 'actionColOptions.span',
      component: 'Slider',
      defaultValue: 24,
      label: 'span',
      colProps: { span: 24 },
      componentProps: {
        min: 1,
        max: 24,
      },
    },
    {
      field: '',
      component: 'Divider',
      label: '操作按钮',
      colProps: { span: 24 },
      componentProps: {
        orientation: 'center',
      },
    },
    {
      field: 'showActionButtonGroup',
      defaultValue: true,
      component: 'Switch',
      label: '操作按钮',
      colProps: { span: 24 },
      componentProps: ({ formActionType }) => {
        return {
          size: 'small',
          onChange: async (val: boolean) => {
            formActionType.updateSchema([
              { field: 'showResetButton', componentProps: { disabled: !val } },
              {
                field: 'showSubmitButton',
                componentProps: { disabled: !val },
              },
            ]);
          },
        };
      },
    },
    {
      field: 'showResetButton',
      defaultValue: true,
      component: 'Switch',
      label: '重置按钮',
      colProps: { span: 24 },
      componentProps: {
        size: 'small',
      },
    },
    {
      field: 'showSubmitButton',
      defaultValue: true,
      component: 'Switch',
      label: '提交按钮',
      colProps: { span: 24 },
      componentProps: {
        size: 'small',
      },
    },
  ];

  export default defineComponent({
    components: {
      BasicForm,
      CollapseContainer,
      PageWrapper,
      Drawer,
      Space,
    },
    setup() {
      const visible = ref<boolean>(false);
      const settingFormRef = ref();
      const [registerSetting] = useForm({
        labelWidth: 80,
        schemas: formSchemas,
        compact: true,
        actionColOptions: { span: 24 },
        showActionButtonGroup: false,
      });

      const resetSettings = async () => {
        await settingFormRef.value?.resetFields();
      };

      const handleSubmitSetting = async (values: Recordable) => {
        await setProps(values);
        visible.value = false;
      };

      const [register, { setProps, setFieldsValue, updateSchema }] = useForm({
        labelWidth: 120,
        schemas,
        actionColOptions: { span: 24 },
        fieldMapToTime: [['fieldTime', ['startTime', 'endTime'], 'YYYY-MM']],
      });

      async function handleLoad() {
        const promiseFn = function () {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                field9: ['430000', '430100', '430102'],
                province: '湖南省',
                city: '长沙市',
                district: '岳麓区',
              });
            }, 1000);
          });
        };

        const item = await promiseFn();

        const { field9, province, city, district } = item as any;
        await updateSchema({
          field: 'field9',
          componentProps: {
            displayRenderArray: [province, city, district],
          },
        });
        await setFieldsValue({ field9 });
      }

      const showDrawer = () => {
        visible.value = true;
      };

      const onSettings = () => {
        settingFormRef.value?.submit();
      };

      return {
        register,
        schemas,
        handleSubmit: (values: Recordable) => {
          console.log(values);
        },
        setProps,
        handleLoad,
        visible,
        showDrawer,
        settingFormRef,
        onSettings,
        resetSettings,
        registerSetting,
        handleSubmitSetting,
      };
    },
  });
</script>
