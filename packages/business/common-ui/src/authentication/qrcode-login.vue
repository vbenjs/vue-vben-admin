<script setup lang="ts">
import { VbenButton } from '@vben-core/shadcn-ui';

import { $t } from '@vben/locales';
import { useQRCode } from '@vueuse/integrations/useQRCode';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import Title from './auth-title.vue';

defineOptions({
  name: 'AuthenticationQrCodeLogin',
});

const router = useRouter();

const text = ref('https://vben.vvbin.cn');

const qrcode = useQRCode(text, {
  errorCorrectionLevel: 'H',
  margin: 4,
});

function handleGo(path: string) {
  router.push(path);
}
</script>

<template>
  <div>
    <Title>
      {{ $t('authentication.welcome-back') }} 📱
      <template #desc>
        <span class="text-muted-foreground">
          {{ $t('authentication.qrcode-subtitle') }}
        </span>
      </template>
    </Title>

    <div class="flex-col-center mt-6">
      <img :src="qrcode" alt="qrcode" class="w-1/2" />
      <p class="text-muted-foreground mt-4 text-sm">
        {{ $t('authentication.qrcode-prompt') }}
      </p>
    </div>

    <VbenButton
      class="mt-4 w-full"
      variant="outline"
      @click="handleGo('/auth/login')"
    >
      {{ $t('common.back') }}
    </VbenButton>
  </div>
</template>
