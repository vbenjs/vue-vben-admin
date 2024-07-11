<script setup lang="ts">
import { computed } from 'vue';

import {
  AuthenticationLogin,
  AuthenticationProps,
  LoginAndRegisterParams,
} from '@vben/universal-ui';
import { Dialog, DialogContent } from '@vben-core/shadcn-ui';

interface Props extends AuthenticationProps {
  open: boolean;
}

defineOptions({
  name: 'LoginDialog',
});

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

const emit = defineEmits<{
  login: [LoginAndRegisterParams];
}>();

const loginProps = computed(() => {
  const { open: _, ...rest } = props;
  return rest;
});
</script>

<template>
  <div>
    <Dialog :open="open" class="flex items-center justify-center">
      <DialogContent
        class="top-[50%] w-full translate-y-[-50%] border-none p-0 shadow-xl sm:w-[600px] sm:rounded-2xl"
      >
        <div class="p-4">
          <AuthenticationLogin
            v-bind="loginProps"
            @submit="(e) => emit('login', e)"
          />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
