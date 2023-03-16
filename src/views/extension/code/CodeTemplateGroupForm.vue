<script lang="ts" setup>
  import { BasicForm, useForm } from '/@/components/Form';

  import { templateGroupSchemas } from './data';

  const [register, { validate }] = useForm({
    labelWidth: 100,
    schemas: templateGroupSchemas,
    actionColOptions: {
      span: 14,
    },
    resetButtonOptions: {
      text: '上一步',
    },
    submitButtonOptions: {
      text: '生成',
    },
    resetFunc: prev,
    submitFunc: next,
  });

  const emit = defineEmits(['prev', 'next']);

  async function prev() {
    emit('prev');
  }

  async function next() {
    try {
      const values = await validate();
      emit('next', values);
    } catch (error) {}
  }
</script>
<template>
  <div class="step1">
    <div class="step1-form">
      <BasicForm @register="register" />
    </div>
  </div>
</template>
<style lang="less" scoped>
  .step1 {
    &-form {
      width: 450px;
      margin: 0 auto;
    }

    h3 {
      margin: 0 0 12px;
      font-size: 16px;
      line-height: 32px;
      color: @text-color;
    }

    h4 {
      margin: 0 0 4px;
      font-size: 14px;
      line-height: 22px;
      color: @text-color;
    }

    p {
      color: @text-color;
    }
  }

  .pay-select {
    width: 20%;
  }

  .pay-input {
    width: 70%;
  }
</style>
