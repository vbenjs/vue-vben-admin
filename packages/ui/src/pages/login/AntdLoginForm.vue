<script setup lang="ts">
  import { Form } from 'ant-design-vue';
  // import VerifyCode from '../../verify-code/index.vue';

  // interface Props {
  //   loginFunc?: (params: { username: string; password: string }) => Promise<void>;
  // }

  // const formModel = $ref({
  //   username: '',
  //   password: '',
  // });

  // let loading = $ref(false);
  // let showCode = $ref(false);

  // const formRef = $ref<FormInst | null>(null);

  // const rules = $ref({
  //   username: {
  //     required: true,
  //     trigger: ['blur', 'input'],
  //     message: '请输入用户名',
  //   },
  //   password: {
  //     required: true,
  //     trigger: ['blur', 'input'],
  //     message: '请输入密码',
  //   },
  // });

  // const props = defineProps<Props>();

  // const [bem] = createBEM('login-form');

  // function handleLogin(e: MouseEvent) {
  //   e?.preventDefault();

  //   formRef?.validate(async (errors) => {
  //     if (!errors) {
  //       showCode = true;
  //     }
  //   });
  // }

  // async function handleVerifySuccess() {
  //   try {
  //     loading = true;
  //     await props.loginFunc?.(formModel);
  //   } finally {
  //     showCode = false;
  //     loading = false;
  //   }
  // }
</script>

<template>
  <!-- <verify-code :show="showCode" @success="handleVerifySuccess" /> -->
  <Form>
    <Form.Item>1</Form.Item>
  </Form>
</template>

<style lang="scss" module scoped>
  .login-form {
    width: 80%;

    &__title {
      width: 100%;
      font-size: 24px;
      color: var(--text-color-login-title);
    }
  }
</style>
