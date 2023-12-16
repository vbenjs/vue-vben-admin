<template>
  <PageWrapper title="表单增删示例">
    <CollapseContainer title="表单增删">
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
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { CollapseContainer } from '@/components/Container';
  import { PageWrapper } from '@/components/Page';

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
        // component: 'Input',
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
</script>
