<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { $t } from '@vben/locales';
import { VbenButton } from '@vben-core/shadcn-ui';

import { useQRCode } from '@vueuse/integrations/useQRCode';

import Title from './auth-title.vue';

interface Props {
  /**
   * @zh_CN 是否处于加载处理状态
   */
  loading?: boolean;
  /**
   * @zh_CN 登陆路径
   */
  loginPath?: string;
}

defineOptions({
  name: 'AuthenticationQrCodeLogin',
});

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loginPath: '/auth/login',
});

const router = useRouter();

const text = ref('https://vben.vvbin.cn');

const qrcode = useQRCode(text, {
  errorCorrectionLevel: 'H',
  margin: 4,
});

function goToLogin() {
  router.push(props.loginPath);
}
</script>

<template>
  <div>
    <Title>
      {{ $t('authentication.welcomeBack') }} 📱
      <template #desc>
        <span class="text-muted-foreground">
          {{ $t('authentication.qrcodeSubtitle') }}
        </span>
      </template>
    </Title>

    <div class="flex-col-center mt-6">
      <img :src="qrcode" alt="qrcode" class="w-1/2" />
      <p class="text-muted-foreground mt-4 text-sm">
        {{ $t('authentication.qrcodePrompt') }}
      </p>
    </div>

    <VbenButton class="mt-4 w-full" variant="outline" @click="goToLogin()">
      {{ $t('common.back') }}
    </VbenButton>
  </div>
</template>
