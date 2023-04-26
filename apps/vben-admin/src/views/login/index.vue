<script lang="ts" setup>
  import { Login } from '@vben/ui';

  import LoginForm from './LoginForm.vue';

  defineOptions({
    name: 'Login',
  });
</script>

<template>
  <Login
    app-name="Vben Admin"
    title="开箱即用的中后台管理系统"
    description="输入您的个人详细信息开始使用！"
  >
    <template #form>
      <LoginForm />
    </template>
  </Login>
</template>
