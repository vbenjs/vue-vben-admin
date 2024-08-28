<script setup lang="ts">
import type { AuthenticationProps, LoginAndRegisterParams } from './types';

import { watch } from 'vue';

import { useForwardPropsEmits } from '@vben/hooks';
import { useVbenModal } from '@vben-core/popup-ui';
import { VbenAvatar } from '@vben-core/shadcn-ui';

import AuthenticationLogin from './login.vue';

interface Props extends AuthenticationProps {
  avatar?: string;
}

defineOptions({
  name: 'LoginExpiredModal',
});

const props = withDefaults(defineProps<Props>(), {
  avatar: '',
});

const emit = defineEmits<{
  submit: [LoginAndRegisterParams];
}>();

const open = defineModel<boolean>('open');

const forwarded = useForwardPropsEmits(props, emit);

const [Modal, modalApi] = useVbenModal();

watch(
  () => open.value,
  (val) => {
    modalApi.setState({ isOpen: val });
  },
);
</script>

<template>
  <div>
    <Modal
      :closable="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :footer="false"
      :fullscreen-button="false"
      :header="false"
      class="border-none px-10 py-6 text-center shadow-xl sm:w-[600px] sm:rounded-2xl md:h-[unset]"
    >
      <VbenAvatar :src="avatar" class="mx-auto mb-6 size-20" />
      <AuthenticationLogin
        v-bind="forwarded"
        :show-forget-password="false"
        :show-register="false"
        :show-remember-me="false"
        :sub-title="$t('authentication.loginAgainSubTitle')"
        :title="$t('authentication.loginAgainTitle')"
      />
    </Modal>
  </div>
</template>
