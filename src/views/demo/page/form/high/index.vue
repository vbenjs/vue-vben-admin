<template>
  <PageWrapper
    class="high-form"
    title="高级表单"
    content=" 高级表单常见于一次性输入和提交大批量数据的场景。"
  >
    <Card title="仓库管理" :bordered="false">
      <BasicForm @register="register" />
    </Card>
    <Card title="任务管理" :bordered="false" class="!mt-5">
      <BasicForm @register="registerTask" />
    </Card>
    <Card title="成员管理" :bordered="false" class="!mt-5">
      <PersonTable ref="tableRef" />
    </Card>

    <template #rightFooter>
      <a-button type="primary" @click="submitAll"> 提交 </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { BasicForm, useForm } from '@/components/Form';
  import { ref } from 'vue';
  import PersonTable from './PersonTable.vue';
  import { PageWrapper } from '@/components/Page';
  import { schemas, taskSchemas } from './data';
  import { Card } from 'ant-design-vue';

  defineOptions({ name: 'FormHightPage' });

  const tableRef = ref<{ getDataSource: () => any } | null>(null);

  const [register, { validate }] = useForm({
    layout: 'vertical',
    baseColProps: {
      span: 6,
    },
    schemas: schemas,
    showActionButtonGroup: false,
  });

  const [registerTask, { validate: validateTaskForm }] = useForm({
    layout: 'vertical',
    baseColProps: {
      span: 6,
    },
    schemas: taskSchemas,
    showActionButtonGroup: false,
  });

  async function submitAll() {
    try {
      if (tableRef.value) {
        console.log('table data:', tableRef.value.getDataSource());
      }

      const [values, taskValues] = await Promise.all([validate(), validateTaskForm()]);
      console.log('form data:', values, taskValues);
    } catch (error) {
      console.log(error);
    }
  }
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }
</style>
