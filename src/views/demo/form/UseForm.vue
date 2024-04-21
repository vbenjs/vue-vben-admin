<template>
  <PageWrapper title="UseForm操作示例">
    <a-button class="mb-4" type="primary" @click="showDrawer"> 更改设置 </a-button>

    <Drawer v-model:open="open" title="更改设置" placement="right">
      <BasicForm ref="settingFormRef" @register="registerSetting" @submit="handleSubmitSetting">
        <template #other>
          <Space>
            <a-button
              @click="() => withClose({ resetButtonOptions: { disabled: true, text: '重置New' } })"
            >
              修改重置按钮
            </a-button>
            <a-button
              @click="() => withClose({ submitButtonOptions: { disabled: true, loading: true } })"
            >
              修改查询按钮
            </a-button>
            <a-button @click="handleLoad" class="mr-2"> 联动回显 </a-button>
          </Space>
        </template>
      </BasicForm>
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

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Drawer, Space } from 'ant-design-vue';
  import { BasicForm, type FormSchema, useForm, type FormProps } from '@/components/Form';
  import { CollapseContainer } from '@/components/Container';
  import { PageWrapper } from '@/components/Page';
  import { areaRecord } from '@/api/demo/cascader';

  const sizeList = [
    { value: 'large', label: 'large' },
    { value: 'middle', label: 'middle' },
    { value: 'small', label: 'small' },
    { value: 'default', label: 'defualt' },
  ];

  const layoutList = [
    { value: 'vertical', label: 'vertical' },
    { value: 'inline', label: 'inline' },
    { value: 'horizontal', label: 'horizontal' },
  ];

  const labelAlignList = [
    { value: 'left', label: 'left' },
    { value: 'right', label: 'right' },
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
      componentProps: {
        getPopupContainer: () => {
          return document.querySelector('.ant-form')!;
        },
      },
    },
    {
      field: 'fieldTime',
      component: 'RangePicker',
      label: '时间字段',
      colProps: { span: 8 },
      componentProps: {
        getPopupContainer: () => {
          return document.querySelector('.ant-form')!;
        },
      },
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
      field: 'd1',
      component: 'Divider',
      label: '基础属性',
      colProps: { span: 24 },
      componentProps: {
        orientation: 'center',
      },
    },
    {
      field: 'name',
      defaultValue: 'useForm',
      component: 'Input',
      label: 'name',
      colProps: { span: 24 },
    },
    {
      field: 'layout',
      defaultValue: 'horizontal',
      component: 'RadioButtonGroup',
      label: 'layout',
      colProps: { span: 24 },
      componentProps: {
        options: layoutList,
      },
    },
    {
      field: 'labelAlign',
      defaultValue: 'right',
      component: 'RadioButtonGroup',
      label: 'labelAlign',
      colProps: { span: 24 },
      componentProps: {
        options: labelAlignList,
      },
    },
    {
      field: 'labelWidth',
      defaultValue: 120,
      component: 'InputNumber',
      label: 'labelWidth',
      colProps: { span: 24 },
    },
    {
      field: 'size',
      defaultValue: 'default',
      component: 'Select',
      label: 'size',
      colProps: { span: 24 },
      componentProps: {
        options: sizeList,
      },
    },
    {
      field: 'colon',
      defaultValue: false,
      component: 'Switch',
      label: 'colon',
      colProps: { span: 24 },
    },
    {
      field: 'disabled',
      defaultValue: false,
      component: 'Switch',
      label: 'disabled',
      colProps: { span: 24 },
    },
    {
      field: 'compact',
      defaultValue: false,
      component: 'Switch',
      label: 'compact',
      colProps: { span: 24 },
    },
    {
      field: 'autoSetPlaceHolder',
      defaultValue: true,
      component: 'Switch',
      label: 'autoSetPlaceHolder',
      colProps: { span: 24 },
    },
    {
      field: 'autoSubmitOnEnter',
      defaultValue: false,
      component: 'Switch',
      label: 'autoSubmitOnEnter',
      colProps: { span: 24 },
    },
    {
      field: 'showAdvancedButton',
      defaultValue: false,
      component: 'Switch',
      label: 'showAdvancedButton',
      colProps: { span: 24 },
    },

    {
      field: 'd2',
      component: 'Divider',
      label: '网格布局(rowProps)',
      colProps: { span: 24 },
      componentProps: {
        orientation: 'center',
      },
    },
    {
      field: 'rowProps.gutter.0',
      component: 'InputNumber',
      defaultValue: 0,
      label: 'Horizontal Gutter',
      colProps: { span: 24 },
      componentProps: {
        addonAfter: 'px',
      },
    },
    {
      field: 'rowProps.gutter.1',
      component: 'InputNumber',
      defaultValue: 0,
      label: 'Vertical Gutter',
      colProps: { span: 24 },
      componentProps: {
        addonAfter: 'px',
      },
    },
    {
      field: 'rowProps.align',
      defaultValue: 'top',
      component: 'Select',
      label: 'align',
      colProps: { span: 24 },
      componentProps: {
        options: [
          { value: 'stretch', label: 'stretch' },
          { value: 'bottom', label: 'bottom' },
          { value: 'top', label: 'top' },
          { value: 'middle', label: 'middle' },
        ],
      },
    },
    {
      field: 'rowProps.justify',
      defaultValue: 'start',
      component: 'Select',
      label: 'justify',
      colProps: { span: 24 },
      componentProps: {
        options: [
          { value: 'space-around', label: 'space-around' },
          { value: 'space-between', label: 'space-between' },
          { value: 'center', label: 'center' },
          { value: 'end', label: 'end' },
          { value: 'start', label: 'start' },
        ],
      },
    },
    {
      field: 'wrap',
      defaultValue: true,
      component: 'Switch',
      label: 'wrap',
      colProps: { span: 24 },
    },

    {
      field: 'd3',
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
      label: 'showActionButtonGroup',
      colProps: { span: 24 },
      componentProps: ({ formActionType }) => {
        return {
          onChange: (val) => {
            formActionType.updateSchema([
              { field: 'showResetButton', componentProps: { disabled: !val } },
              {
                field: 'showSubmitButton',
                componentProps: { disabled: !val },
              },
              {
                field: 'actionColOptions.span',
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
      label: 'showResetButton',
      colProps: { span: 24 },
    },
    {
      field: 'showSubmitButton',
      defaultValue: true,
      component: 'Switch',
      label: 'showSubmitButton',
      colProps: { span: 24 },
    },

    {
      field: 'd4',
      component: 'Divider',
      label: '操作按钮网格布局(actionColOptions)',
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
      componentProps: { min: 0, max: 24 },
    },
    {
      field: 'd5',
      component: 'Divider',
      label: '其他事件',
      colProps: { span: 24 },
      componentProps: {
        orientation: 'center',
      },
    },
    {
      field: 'other',
      component: 'Input',
      label: '',
      colProps: { span: 24 },
      colSlot: 'other',
    },
  ];

  const open = ref<boolean>(false);
  const settingFormRef = ref();
  const [registerSetting] = useForm({
    size: 'small',
    schemas: formSchemas,
    compact: true,
    actionColOptions: { span: 24 },
    showActionButtonGroup: false,
  });
  const resetSettings = async () => {
    setProps({ resetButtonOptions: { disabled: false, text: '重置' } });
    setProps({ submitButtonOptions: { disabled: false, loading: false } });
    await setFieldsValue({ field9: [] });
    await settingFormRef.value?.resetFields();
  };
  const handleSubmitSetting = async (values) => {
    console.log(values);
    await setProps(values);
    open.value = false;
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
    open.value = false;
  }
  const showDrawer = () => {
    open.value = true;
  };
  const onSettings = () => {
    settingFormRef.value?.submit();
  };
  const withClose = (formProps: Partial<FormProps>) => {
    setProps(formProps);
    open.value = false;
  };

  function handleSubmit(values) {
    console.log(values);
  }
</script>
