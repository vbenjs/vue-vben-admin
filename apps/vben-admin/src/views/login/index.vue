<script lang="ts" setup>
  import { Login } from '@vben/ui';

  defineOptions({
    name: 'Login',
  });

  // TODO: 补充登录函数
  async function handleLogin() {}
</script>

<template>
  <Login
    app-name="Vben Admin"
    title="开箱即用的中后台管理系统"
    description="输入您的个人详细信息开始使用！"
    :login-func="handleLogin"
  />
</template>
