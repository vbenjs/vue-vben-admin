<template>
  <div class="high-form">
    <a-page-header title="高级表单" :ghost="false">
      高级表单常见于一次性输入和提交大批量数据的场景。
    </a-page-header>

    <div class="m-5">
      <a-card title="仓库管理" :bordered="false">
        <BasicForm @register="register" />
      </a-card>
      <a-card title="任务管理" :bordered="false" class="mt-5">
        <BasicForm @register="registerTask" />
      </a-card>
      <a-card title="成员管理" :bordered="false" class="mt-5">
        <PersonTable ref="tableRef" />
      </a-card>
    </div>

    <PageFooter>
      <template #right>
        <a-button type="primary" @click="submitAll">提交</a-button>
      </template>
    </PageFooter>
  </div>
</template>
<script lang="ts">
  import { BasicForm, useForm } from '/@/components/Form';
  import { defineComponent, ref } from 'vue';
  import PersonTable from './PersonTable.vue';
  import { PageFooter } from '/@/components/Page';

  import { schemas, taskSchemas } from './data';

  export default defineComponent({
    components: { BasicForm, PersonTable, PageFooter },
    setup() {
      const tableRef = ref<{ getDataSource: () => any } | null>(null);

      const [register, { validate }] = useForm({
        baseColProps: {
          span: 6,
        },
        schemas: schemas,
        showActionButtonGroup: false,
      });

      const [registerTask, { validate: validateTaskForm }] = useForm({
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
        } catch (error) {}
      }

      return { register, registerTask, submitAll, tableRef };
    },
  });
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }
</style>
