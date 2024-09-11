<template>
  <PageWrapper title="自定义组件示例">
    <CollapseContainer title="自定义表单">
      <BasicForm class="local_form" @register="register" @submit="handleSubmit">
        <template #f3="{ model, field, disabled }">
          <a-input v-model:value="model[field]" :disabled="disabled" placeholder="自定义slot" />
        </template>
        <template #colSlot_field5="{ model, field, disabled }">
          <FormItem :name="field" label="自定义colSlot" :rules="[{ required: true }]">
            <a-input
              v-model:value="model[field]"
              :disabled="disabled"
              placeholder="自定义colSlot"
            />
          </FormItem>
        </template>
      </BasicForm>
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="tsx" setup>
  import { h } from 'vue';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { CollapseContainer } from '@/components/Container';
  import { useMessage } from '@/hooks/web/useMessage';
  import { Input, FormItem, FormItemRest, Select } from 'ant-design-vue';
  import { PageWrapper } from '@/components/Page';

  const custom_typeKey2typeValueRules = (model) => {
    return [
      {
        required: true,
        validator: async () => {
          if (!model.typeKey) return Promise.reject('请选择类型');
          if (!model.typeValue) return Promise.reject('请输入数据');
          Promise.resolve();
        },
      },
    ];
  };
  const schemas: FormSchema[] = [
    {
      field: 'field1',
      component: 'Input',
      label: 'render方式',
      colProps: {
        span: 8,
      },
      dynamicDisabled: ({ values }) => {
        return !!values.field_disabled;
      },
      rules: [{ required: true }],
      render: ({ model, field }, { disabled }) => {
        return h(Input, {
          placeholder: '请输入',
          value: model[field],
          onChange: (e) => {
            model[field] = e.target.value;
          },
          disabled,
        });
      },
    },
    {
      field: 'field2',
      component: 'Input',
      label: 'render组件slot',
      colProps: {
        span: 8,
      },
      dynamicDisabled: ({ values }) => {
        return !!values.field_disabled;
      },
      rules: [{ required: true }],
      renderComponentContent: (_, { disabled }) => {
        return {
          suffix: () => (disabled ? 'suffix_disabled' : 'suffix_default'),
        };
      },
    },
    {
      field: 'field3',
      label: '自定义Slot',
      slot: 'f3',
      colProps: {
        span: 8,
      },
      dynamicDisabled: ({ values }) => {
        return !!values.field_disabled;
      },
      rules: [{ required: true }],
    },
    {
      field: 'field4',
      component: 'Input',
      // label: 'renderColContent渲染',
      /**!!!renderColContent 没有FormItem 包裹, 若想要 Form 提交需要带上数据须 <FormItem name={}></FormItem> 包裹： 示例如下*/
      renderColContent({ model, field }, { disabled }) {
        return (
          <FormItem name="field4" label="renderColContent渲染" rules={[{ required: true }]}>
            <Input placeholder="请输入" v-model:value={model[field]} disabled={disabled}></Input>
          </FormItem>
        );
      },
      colProps: {
        span: 8,
      },
      dynamicDisabled: ({ values }) => {
        return !!values.field_disabled;
      },
    },
    {
      field: 'field5',
      component: 'Input',
      label: '自定义colSlot',
      /**!!!renderColContent 没有FormItem 包裹, 若想要 Form 提交需要带上数据须 <FormItem name={}></FormItem> 包裹： 示例如下*/
      colSlot: 'colSlot_field5',
      colProps: {
        span: 8,
      },
      dynamicDisabled: ({ values }) => {
        return !!values.field_disabled;
      },
    },
    // 复合field 场景 自定义表单控件 一个控件包含多个表单录入 示例: 选择+输入
    {
      required: true,
      field: 'typeKey2',
      defaultValue: '测试类型',
      fields: ['typeValue2'],
      defaultValueObj: { typeValue2: '默认测试_文字' },
      component: 'Input',
      label: '复合field render',
      render({ model, field }, { disabled }) {
        return (
          <Input.Group compact>
            <Select
              disabled={disabled}
              style="width: 120px"
              allowClear
              v-model:value={model[field]}
            >
              <Select.Option value="测试类型">测试类型</Select.Option>
              <Select.Option value="测试名称">测试名称</Select.Option>
            </Select>
            <FormItem name="typeValue2" class="local_typeValue" rules={[{ required: true }]}>
              <FormItemRest>
                <Input
                  placeholder="请输入"
                  v-model:value={model['typeValue2']}
                  disabled={disabled}
                />
              </FormItemRest>
            </FormItem>
          </Input.Group>
        );
      },
      colProps: {
        span: 8,
      },
      dynamicDisabled: ({ values }) => {
        return !!values.field_disabled;
      },
    },
    // 复合field 场景 自定义表单控件 一个控件包含多个表单录入 示例: 选择+输入
    {
      field: 'typeKey',
      defaultValue: '公司名称',
      fields: ['typeValue'],
      defaultValueObj: { typeValue: '默认文字' },
      component: 'Input',
      // label: 'renderColContent渲染',
      /**!!!renderColContent 没有FormItem 包裹, 若想要 Form 提交需要带上数据须 <FormItem name={}></FormItem> 包裹： 示例如下*/
      renderColContent({ model, field }, { disabled }) {
        return (
          <FormItem
            name="typeKey"
            label="复合field renderColContent"
            rules={custom_typeKey2typeValueRules(model)}
          >
            <Input.Group compact>
              <Select
                allowClear
                disabled={disabled}
                style="width: 120px"
                v-model:value={model[field]}
              >
                <Select.Option value="公司名称">公司名称</Select.Option>
                <Select.Option value="产品名称">产品名称</Select.Option>
              </Select>
              <FormItemRest>
                <Input
                  style="width: calc(100% - 120px); margin-left: -1px;"
                  placeholder="请输入"
                  v-model:value={model['typeValue']}
                  disabled={disabled}
                />
              </FormItemRest>
            </Input.Group>
          </FormItem>
        );
      },
      colProps: {
        span: 16,
      },
      dynamicDisabled: ({ values }) => {
        return !!values.field_disabled;
      },
    },
    {
      field: 'field_disabled',
      component: 'Switch',
      label: '是否禁用 编辑字段',
      colProps: {
        span: 8,
      },
      labelWidth: 200,
    },
  ];
  const { createMessage } = useMessage();

  const [register] = useForm({
    labelWidth: 120,
    schemas,
    actionColOptions: {
      span: 24,
    },
  });

  function handleSubmit(values: any) {
    console.log('submit values', values);
    createMessage.success('click search,values:' + JSON.stringify(values));
  }
</script>

<style lang="less" scoped>
  :deep(.local_form) .local_typeValue {
    width: calc(100% - 120px);
    margin-bottom: 0;
    margin-left: -1px;
    border-right: 0;

    .ant-input {
      border-radius: 0 6px 6px 0;
    }
  }
</style>
