<script setup lang="ts">
  import { useAsyncState } from '@vben/hooks';
  import type { LoginFormState } from '@vben/types';
  import { Button, Checkbox, Form, Input } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { reactive } from 'vue';

  defineOptions({
    name: 'LoginForm',
  });

  interface Props {
    /**
     * @description 登录函数
     */
    loginFunc: (form: LoginFormState) => Promise<void>;
  }

  const props = withDefaults(defineProps<Props>(), {});

  const formModel = reactive<LoginFormState>({
    username: '',
    password: '',
    rememberMe: false,
  });

  const formRules = reactive<Record<string, Rule[]>>({
    username: [
      {
        required: true,
        message: '请输入用户名',
      },
    ],
    password: [
      {
        required: true,
        message: '请输入密码',
      },
    ],
  });

  const useForm = Form.useForm;

  const { validate, validateInfos } = useForm(formModel, formRules);

  const { isLoading, execute } = useAsyncState(
    async () => {
      await props?.loginFunc?.(formModel);
    },
    null,
    { immediate: false },
  );

  async function handleLogin(e: MouseEvent) {
    e?.preventDefault();

    const values = await validate();
    if (!values) {
      return;
    }
    await execute();
  }
</script>

<template>
  <Form class="enter-x">
    <Form.Item v-bind="validateInfos.username" class="enter-x">
      <Input v-model:value="formModel.username" size="large" placeholder="用户名" />
    </Form.Item>
    <Form.Item v-bind="validateInfos.password" class="enter-x">
      <Input.Password v-model:value="formModel.password" size="large" placeholder="密码" />
    </Form.Item>
    <div class="enter-x flex">
      <Form.Item v-bind="validateInfos.rememberMe" class="flex-1">
        <Checkbox v-model:checked="formModel.rememberMe">记住我</Checkbox>
      </Form.Item>
      <Form.Item class="flex-1 text-right">
        <Button type="link">忘记密码</Button>
      </Form.Item>
    </div>
    <Form.Item class="enter-x">
      <Button type="primary" size="large" :loading="isLoading" block @click="handleLogin">
        登录
      </Button>
    </Form.Item>
  </Form>
</template>
