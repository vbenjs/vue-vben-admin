<template>
  <template v-if="getShow">
    <!-- <LoginFormTitle class="enter-x" style="align: center; margin-bottom: 0" /> -->
    <div class="enter-x">
      <QrCode
        :value="qrCodeUrl"
        class="enter-x flex justify-center xl:justify-start"
        :width="220"
        :logo="LogoImg"
      />
      <Button size="large" block class="enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </div>
  </template>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  // import LoginFormTitle from './LoginFormTitle.vue';
  import { Button } from 'ant-design-vue';
  import { QrCode } from '@/components/Qrcode/index';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useLoginState, LoginStateEnum } from './useLogin';
  import LogoImg from '@/assets/images/logo.png';
  // const qrCodeUrl = 'http://' + window.location.host + '/mobile/';
  const qrCodeUrl = '';

  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.QR_CODE);
</script>
