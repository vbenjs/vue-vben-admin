<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { Button, Card, message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';

import DocButton from '../doc-button.vue';

const [BaseForm, baseFormApi] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  fieldMappingTime: [['rangePicker', ['startTime', 'endTime'], 'YYYY-MM-DD']],
  // 提交函数
  handleSubmit: onSubmit,

  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入用户名',
      },
      // 字段名
      fieldName: 'username',
      // 界面显示的label
      label: '字符串',
    },
    {
      component: 'InputPassword',
      componentProps: {
        placeholder: '请输入密码',
      },
      fieldName: 'password',
      label: '密码',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'number',
      label: '数字(带后缀)',
      suffix: () => '¥',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          {
            label: '选项1',
            value: '1',
          },
          {
            label: '选项2',
            value: '2',
          },
        ],
        placeholder: '请选择',
        showSearch: true,
      },
      fieldName: 'options',
      label: '下拉选',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: '选项1',
            value: '1',
          },
          {
            label: '选项2',
            value: '2',
          },
        ],
      },
      fieldName: 'radioGroup',
      label: '单选组',
    },
    {
      component: 'Radio',
      fieldName: 'radio',
      label: '',
      renderComponentContent: () => {
        return {
          default: () => ['Radio'],
        };
      },
    },
    {
      component: 'CheckboxGroup',
      componentProps: {
        name: 'cname',
        options: [
          {
            label: '选项1',
            value: '1',
          },
          {
            label: '选项2',
            value: '2',
          },
        ],
      },
      fieldName: 'checkboxGroup',
      label: '多选组',
    },
    {
      component: 'Checkbox',
      fieldName: 'checkbox',
      label: '',
      renderComponentContent: () => {
        return {
          default: () => ['我已阅读并同意'],
        };
      },
    },
    {
      component: 'Mentions',
      componentProps: {
        options: [
          {
            label: 'afc163',
            value: 'afc163',
          },
          {
            label: 'zombieJ',
            value: 'zombieJ',
          },
        ],
        placeholder: '请输入',
      },
      fieldName: 'mentions',
      label: '提及',
    },
    {
      component: 'Rate',
      fieldName: 'rate',
      label: '评分',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'switch',
      label: '开关',
    },
    {
      component: 'DatePicker',
      fieldName: 'datePicker',
      label: '日期选择框',
    },
    {
      component: 'RangePicker',
      fieldName: 'rangePicker',
      label: '范围选择器',
    },
    {
      component: 'TimePicker',
      fieldName: 'timePicker',
      label: '时间选择框',
    },
    {
      component: 'TreeSelect',
      componentProps: {
        allowClear: true,
        placeholder: '请选择',
        showSearch: true,
        treeData: [
          {
            label: 'root 1',
            value: 'root 1',
            children: [
              {
                label: 'parent 1',
                value: 'parent 1',
                children: [
                  {
                    label: 'parent 1-0',
                    value: 'parent 1-0',
                    children: [
                      {
                        label: 'my leaf',
                        value: 'leaf1',
                      },
                      {
                        label: 'your leaf',
                        value: 'leaf2',
                      },
                    ],
                  },
                  {
                    label: 'parent 1-1',
                    value: 'parent 1-1',
                  },
                ],
              },
              {
                label: 'parent 2',
                value: 'parent 2',
              },
            ],
          },
        ],
        treeNodeFilterProp: 'label',
      },
      fieldName: 'treeSelect',
      label: '树选择',
    },
  ],
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

const [CustomLayoutForm] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'horizontal',
  schema: [
    {
      component: 'Select',
      fieldName: 'field1',
      label: '字符串',
    },
    {
      component: 'TreeSelect',
      fieldName: 'field2',
      label: '字符串',
    },
    {
      component: 'Mentions',
      fieldName: 'field3',
      label: '字符串',
    },
    {
      component: 'Input',
      fieldName: 'field4',
      label: '字符串',
    },
    {
      component: 'InputNumber',
      fieldName: 'field5',
      // 从第三列开始 相当于中间空了一列
      formItemClass: 'col-start-3',
      label: '前面空了一列',
    },
    {
      component: 'Textarea',
      fieldName: 'field6',
      // 占满三列空间 基线对齐
      formItemClass: 'col-span-3 items-baseline',
      label: '占满三列',
    },
    {
      component: 'Input',
      fieldName: 'field7',
      // 占满2列空间 从第二列开始 相当于前面空了一列
      formItemClass: 'col-span-2 col-start-2',
      label: '占满2列',
    },
    {
      component: 'Input',
      fieldName: 'field8',
      // 左右留空
      formItemClass: 'col-start-2',
      label: '左右留空',
    },
    {
      component: 'InputPassword',
      fieldName: 'field9',
      formItemClass: 'col-start-1',
      label: '字符串',
    },
  ],
  // 一共三列
  wrapperClass: 'grid-cols-3',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}

function handleSetFormValue() {
  /**
   * 设置表单值(多个)
   */
  baseFormApi.setValues({
    checkboxGroup: ['1'],
    datePicker: dayjs('2022-01-01'),
    mentions: '@afc163',
    number: 3,
    options: '1',
    password: '2',
    radioGroup: '1',
    rangePicker: [dayjs('2022-01-01'), dayjs('2022-01-02')],
    rate: 3,
    switch: true,
    timePicker: dayjs('2022-01-01 12:00:00'),
    treeSelect: 'leaf1',
    username: '1',
  });

  // 设置单个表单值
  baseFormApi.setFieldValue('checkbox', true);
}
</script>

<template>
  <Page
    content-class="flex flex-col gap-4"
    description="表单组件基础示例，请注意，该页面用到的参数代码会添加一些简单注释，方便理解，请仔细查看。"
    title="表单组件"
  >
    <template #extra>
      <DocButton path="/components/common-ui/vben-form" />
    </template>
    <Card title="基础示例">
      <template #extra>
        <Button type="primary" @click="handleSetFormValue">设置表单值</Button>
      </template>
      <BaseForm />
    </Card>
    <Card title="使用tailwind自定义布局">
      <CustomLayoutForm />
    </Card>
  </Page>
</template>
