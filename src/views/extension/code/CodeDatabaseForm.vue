<script lang="ts" setup>
  import { BasicForm, useForm } from '/@/components/Form';
  import { databaseFormSchemas } from './data';

  const [register, { validate }] = useForm({
    labelWidth: 100,
    schemas: databaseFormSchemas,
    actionColOptions: {
      span: 14,
    },
    showResetButton: false,
    submitButtonOptions: {
      text: '下一步',
    },
    submitFunc: next,
  });

  const emit = defineEmits(['next']);

  async function next() {
    const values = await validate();
    emit('next', values);
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
      color: @text-color;
      font-size: 16px;
      line-height: 32px;
    }

    h4 {
      margin: 0 0 4px;
      color: @text-color;
      font-size: 14px;
      line-height: 22px;
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
