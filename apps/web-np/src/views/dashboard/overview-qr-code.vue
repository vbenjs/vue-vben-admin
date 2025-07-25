<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VbenButton,
} from '@vben/common-ui';
import { useAccessStore } from '@vben/stores';

import { useQRCode } from '@vueuse/integrations/useQRCode';
import { Image } from 'ant-design-vue';

const router = useRouter();
const accessStore = useAccessStore();

const location = router.resolve({
  name: 'auth.token',
  query: { token: accessStore.accessToken },
}).href;

const url = window.location.origin + location;
const qrcode = useQRCode(url, {
  errorCorrectionLevel: 'H',
  margin: 0,
});

const state = reactive({
  showQrCode: false,
});
</script>

<template>
  <Card class="w-full">
    <CardHeader class="pb-2">
      <CardTitle class="text-md flex items-center justify-between">
        <span>Mobile Sign-In</span>
        <VbenButton
          @click="state.showQrCode = true"
          class="w-[100px] !p-0 text-right"
          size="xs"
          variant="link"
        >
          Show QR Code
        </VbenButton>
      </CardTitle>
    </CardHeader>

    <CardContent>
      <div class="flex min-h-[200px] items-center justify-center">
        <Image
          src="/static/images/qr-code-blur.png"
          class="!w-[200px]"
          alt="QR Code"
          :preview="{
            visible: state.showQrCode,
            onVisibleChange: (visible: boolean) => (state.showQrCode = visible),
            src: qrcode,
          }"
        />
      </div>
    </CardContent>
  </Card>
</template>
