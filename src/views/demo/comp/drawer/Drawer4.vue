<template>
  <BasicDrawer v-bind="$attrs" @register="register" title="Drawer Title" width="50%">
    <div :style="{ background: '#fff' }">
      <p class="h-20">外部传递数据: {{ receiveDrawerDataRef }}</p>
      <BasicForm @register="registerForm" />
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, nextTick } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  const schemas: FormSchema[] = [
    {
      field: 'field1',
      component: 'Input',
      label: '字段1',
      colProps: {
        span: 12,
      },
      defaultValue: '111',
    },
    {
      field: 'field2',
      component: 'Input',
      label: '字段2',
      colProps: {
        span: 12,
      },
    },
  ];
  export default defineComponent({
    components: { BasicDrawer, BasicForm },
    setup() {
      const [registerForm, { setFieldsValue }] = useForm({
        labelWidth: 120,
        schemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });
      const [register, { receiveDrawerDataRef }] = useDrawerInner((data) => {
        nextTick(() => {
          // 方式1
          setFieldsValue({
            field2: data.data,
            field1: data.info,
          });
        });
      });
      return { register, receiveDrawerDataRef, schemas, registerForm };
    },
  });
</script>
