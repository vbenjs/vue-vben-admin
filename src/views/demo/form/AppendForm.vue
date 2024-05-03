<template>
  <PageWrapper title="表单增删示例">
    <CollapseContainer title="表单项增删">
      <BasicForm @register="register" @submit="handleSubmit">
        <template #add="{ field }">
          <a-button v-if="Number(field) === 0" @click="add">+</a-button>
          <a-button class="ml-2" v-if="Number(field) === 0" @click="batchAdd">
            批量添加表单配置
          </a-button>
          <a-button v-if="Number(field) > 0" @click="() => del(field)">-</a-button>
        </template>
      </BasicForm>
    </CollapseContainer>
    <CollapseContainer title="表单组增删" class="my-3">
      <a-button @click="setGroup">设置初始值</a-button>
      <a-button class="m-2" @click="addGroup"> 批量添加表单 </a-button>
      <a-button @click="delGroup">批量减少表单</a-button>
      <BasicForm @register="registerGroup" @submit="handleSubmitGroup" />
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { CollapseContainer } from '@/components/Container';
  import { PageWrapper } from '@/components/Page';

  import { useMessage } from '@/hooks/web/useMessage';

  const { createMessage } = useMessage();
  const count = ref(0);
  const [register, { appendSchemaByField, removeSchemaByField, validate }] = useForm({
    schemas: [
      {
        field: 'field0a',
        component: 'Input',
        label: '字段0',
        required: true,
      },
      {
        field: 'field0b',
        component: 'Input',
        label: '字段0',
        required: true,
      },
      {
        field: '0',
        label: ' ',
        slot: 'add',
      },
    ],
    labelWidth: 100,
    actionColOptions: { span: 24 },
    baseColProps: { span: 8 },
  });

  async function handleSubmit() {
    try {
      const data = await validate();
      createMessage.success('请前往控制台查看输出');
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }

  const n = ref(1);

  function add() {
    appendSchemaByField(
      {
        field: `field${n.value}a`,
        component: 'Input',
        label: '字段' + n.value,
        required: true,
      },
      '',
    );
    appendSchemaByField(
      {
        field: `field${n.value}b`,
        component: 'Input',
        label: '字段' + n.value,
        required: true,
      },
      '',
    );

    appendSchemaByField(
      {
        field: `${n.value}`,
        component: 'Input',
        label: ' ',
        slot: 'add',
      },
      '',
    );
    n.value++;
  }
  /**
   * @description: 批量添加
   */
  function batchAdd() {
    appendSchemaByField(
      [
        {
          field: `field${n.value}a`,
          component: 'Input',
          label: '字段' + n.value,
          required: true,
        },
        {
          field: `field${n.value}b`,
          component: 'Input',
          label: '字段' + n.value,
          required: true,
        },
        {
          field: `${n.value}`,
          component: 'Input',
          label: ' ',
          slot: 'add',
        },
      ],
      '',
    );
    n.value++;
  }

  function del(field: string) {
    removeSchemaByField([`field${field}a`, `field${field}b`, `${field}`]);
    n.value--;
  }
  const [
    registerGroup,
    {
      appendSchemaByField: appendSchemaByFieldGroup,
      removeSchemaByField: removeSchemaByFieldGroup,
      getFieldsValue: getFieldsValueGroup,
      setFieldsValue,
    },
  ] = useForm({
    schemas: [
      {
        field: `field[${count.value}].a`,
        component: 'Input',
        label: '字段a',
        colProps: { span: 9 },
      },
      {
        field: `field[${count.value}].b`,
        colProps: { span: 9 },
        component: 'Input',
        label: '字段b',
      },
    ],
    labelWidth: 100,
    actionColOptions: { span: 24 },
    baseColProps: { span: 8 },
  });

  function addGroup() {
    count.value++;
    appendSchemaByFieldGroup(
      [
        {
          field: `field[${count.value}].a`,
          component: 'Input',
          colProps: { span: 9 },
          label: '字段a',
        },
        {
          field: `field[${count.value}].b`,
          component: 'Input',
          colProps: { span: 9 },
          label: '字段b',
        },
      ],
      '',
    );
  }

  function delGroup() {
    removeSchemaByFieldGroup([`field[${count.value}].a`, `field[${count.value}].b`]);
    count.value--;
  }

  function setGroup() {
    setFieldsValue({
      field: [
        {
          a: '默认a',
          b: '默认b',
        },
      ],
    });
  }

  function handleSubmitGroup() {
    createMessage.success('请前往控制台查看输出');
    console.log(getFieldsValueGroup());
  }
</script>
