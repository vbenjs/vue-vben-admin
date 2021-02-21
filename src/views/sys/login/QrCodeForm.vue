<template>
  <div class="enter-x min-w-64 min-h-64">
    <QrCode :value="qrCodeUrl" class="enter-x flex justify-center xl:justify-start" :width="280" />
    <Divider>{{ t('sys.login.scanSign') }}</Divider>
    <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
      {{ t('sys.login.backSignIn') }}
    </Button>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { Button, Divider } from 'ant-design-vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { LoginStateEnum, useLoginState } from './useLogin';
  import { QrCode } from '/@/components/Qrcode/index';
  const qrCodeUrl = 'https://vvbin.cn/next/login';
  export default defineComponent({
    name: 'QrCodeForm',
    components: {
      Button,
      QrCode,
      Divider,
    },
    setup() {
      const { t } = useI18n();
      const { setLoginState } = useLoginState();

      function handleBackLogin() {
        setLoginState(LoginStateEnum.LOGIN);
      }
      return {
        t,
        handleBackLogin,
        qrCodeUrl,
      };
    },
  });
</script>
