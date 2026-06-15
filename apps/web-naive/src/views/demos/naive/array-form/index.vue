<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { NButton, NCard, useMessage } from 'naive-ui';

import { useVbenForm } from '#/adapter/form';

const message = useMessage();

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  wrapperClass: 'grid-cols-1',
  handleSubmit: (values) => {
    message.success(`提交成功：${JSON.stringify(values)}`);
  },
  schema: [
    {
      component: 'Input',
      fieldName: 'projectName',
      label: '项目名称',
      rules: 'required',
    },
    {
      component: 'VbenFormFieldArray',
      fieldName: 'members',
      label: '项目成员',
      // 初始化为空数组，供内部 useFieldArray 使用
      defaultValue: [],
      componentProps: {
        min: 1,
        max: 5,
        createRow: () => ({
          name: null,
          age: null,
          role: null,
          joinDate: null,
          active: true,
        }),
        // 每一列就是一个子字段，复用 vbenForm 的所有编辑组件
        schema: [
          {
            component: 'Input',
            fieldName: 'name',
            label: '姓名',
            rules: 'required',
            componentProps: { placeholder: '请输入姓名' },
          },
          {
            component: 'InputNumber',
            fieldName: 'age',
            label: '年龄',
            componentProps: { min: 0, max: 150 },
          },
          {
            component: 'Select',
            fieldName: 'role',
            label: '角色',
            rules: 'selectRequired',
            componentProps: {
              placeholder: '请选择',
              options: [
                { label: '前端', value: 'fe' },
                { label: '后端', value: 'be' },
                { label: '测试', value: 'qa' },
                { label: '产品', value: 'pm' },
              ],
            },
          },
          {
            component: 'DatePicker',
            fieldName: 'joinDate',
            label: '入职日期',
          },
          {
            component: 'Switch',
            fieldName: 'active',
            label: '在职',
          },
        ],
      },
    },
  ],
});

function setFormValues() {
  formApi.setValues({
    projectName: 'Vben Admin',
    members: [
      { name: '张三', age: 28, role: 'fe', joinDate: Date.now(), active: true },
      {
        name: '李四',
        age: 32,
        role: 'be',
        joinDate: Date.now(),
        active: false,
      },
    ],
  });
}

async function getFormValues() {
  const values = await formApi.getValues();
  message.info(JSON.stringify(values));
}
</script>

<template>
  <Page
    description="基于 useVbenForm 的数组编辑器（VbenFormFieldArray）：可增删行，每个单元格复用 vbenForm 注册的编辑组件，并享受逐格校验。"
    title="数组编辑器表单"
  >
    <NCard title="数组编辑器">
      <template #header-extra>
        <NButton class="mr-2" @click="setFormValues">设置表单值</NButton>
        <NButton class="mr-2" @click="getFormValues">获取表单值</NButton>
        <NButton type="primary" @click="formApi.submitForm()">
          提交校验
        </NButton>
      </template>
      <Form />
    </NCard>
  </Page>
</template>
