<script setup lang="ts">
import { useForwardPropsEmits } from '@vben/hooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  VbenAvatar,
  VisuallyHidden,
} from '@vben-core/shadcn-ui';

import AuthenticationLogin from './login.vue';
import { AuthenticationProps, LoginAndRegisterParams } from './typings';

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
</script>

<template>
  <div>
    <Dialog v-model:open="open">
      <DialogContent
        :show-close="false"
        class="top-1/2 h-full w-full translate-y-[-50%] border-none p-4 py-12 text-center shadow-xl sm:w-[600px] sm:rounded-2xl md:h-[unset] md:px-14 md:pt-12"
        @escape-key-down="(e) => e.preventDefault()"
        @interact-outside="(e) => e.preventDefault()"
      >
        <DialogTitle>
          <VbenAvatar :src="avatar" class="mx-auto size-20" />
        </DialogTitle>
        <VisuallyHidden>
          <DialogDescription />
        </VisuallyHidden>
        <AuthenticationLogin
          v-bind="forwarded"
          :show-forget-password="false"
          :show-register="false"
          :show-remember-me="false"
          :sub-title="$t('authentication.loginAgainSubTitle')"
          :title="$t('authentication.loginAgainTitle')"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>
