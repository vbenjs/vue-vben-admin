<template>
  <PageWrapper title="表单增删示例">
    <CollapseContainer title="表单增删">
      <BasicForm @register="register" @submit="handleSubmit">
        <template #add="{ field }">
          <Button v-if="field === 1" @click="add">+</Button>
          <Button v-if="field > 1" @click="del(field)">-</Button>
        </template>
      </BasicForm>
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { CollapseContainer } from '/@/components/Container/index';
  import { Input } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { Button } from '/@/components/Button';

  export default defineComponent({
    components: { BasicForm, CollapseContainer, PageWrapper, [Input.name]: Input, Button },
    setup() {
      const [register, { appendSchemaByField, removeSchemaByFiled, validate }] = useForm({
        schemas: [
          {
            field: 'field1a',
            component: 'Input',
            label: '字段1',
            colProps: {
              span: 8,
            },
            required: true,
          },
          {
            field: 'field1b',
            component: 'Input',
            label: '字段1',
            colProps: {
              span: 8,
            },
            required: true,
          },
          {
            field: '1',
            component: 'Input',
            label: ' ',
            colProps: {
              span: 8,
            },
            slot: 'add',
          },
        ],
        labelWidth: 100,
        actionColOptions: { span: 24 },
      });

      async function handleSubmit() {
        try {
          const data = await validate();
          console.log(data);
        } catch (e) {
          console.log(e);
        }
      }

      const n = ref(2);

      function add() {
        appendSchemaByField(
          {
            field: 'field' + n.value + 'a',
            component: 'Input',
            label: '字段2',
            colProps: {
              span: 8,
            },
            required: true,
          },
          ''
        );
        appendSchemaByField(
          {
            field: 'field' + n.value + 'b',
            component: 'Input',
            label: '字段2',
            colProps: {
              span: 8,
            },
            required: true,
          },
          ''
        );
        appendSchemaByField(
          {
            field: `${n.value}`,
            component: 'Input',
            label: ' ',
            colProps: {
              span: 8,
            },
            slot: 'add',
          },
          ''
        );
        n.value++;
      }

      function del(field) {
        console.log(field);
        removeSchemaByFiled([`field${field}a`, `field${field}b`, `${field}`]);
      }

      return { register, handleSubmit, add, del };
    },
  });
</script>
