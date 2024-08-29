<script setup lang="ts">
import { computed, reactive } from 'vue';

import { useVbenModal } from '@vben-core/popup-ui';
import {
  VbenAvatar,
  VbenButton,
  VbenInputPassword,
} from '@vben-core/shadcn-ui';

interface Props {
  avatar?: string;
  text?: string;
}

interface LockAndRegisterParams {
  lockScreenPassword: string;
}

interface RegisterEmits {
  submit: [LockAndRegisterParams];
}

defineOptions({
  name: 'LockScreenModal',
});

withDefaults(defineProps<Props>(), {
  avatar: '',
  text: '',
});

const emit = defineEmits<{
  submit: RegisterEmits['submit'];
}>();

const formState = reactive({
  lockScreenPassword: '',
  submitted: false,
});

const [Modal] = useVbenModal({
  onConfirm() {
    handleSubmit();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      // reset value reopen
      formState.submitted = false;
      formState.lockScreenPassword = '';
    }
  },
});

const passwordStatus = computed(() => {
  return formState.submitted && !formState.lockScreenPassword
    ? 'error'
    : 'default';
});

function handleSubmit() {
  formState.submitted = true;
  if (passwordStatus.value !== 'default') {
    return;
  }
  emit('submit', {
    lockScreenPassword: formState.lockScreenPassword,
  });
}
</script>

<template>
  <Modal
    :footer="false"
    :fullscreen-button="false"
    :title="$t('widgets.lockScreen.title')"
  >
    <div
      class="mb-10 flex w-full flex-col items-center px-10"
      @keydown.enter.prevent="handleSubmit"
    >
      <div class="w-full">
        <div class="ml-2 flex w-full flex-col items-center">
          <VbenAvatar
            :src="avatar"
            class="size-20"
            dot-class="bottom-0 right-1 border-2 size-4 bg-green-500"
          />
          <div class="text-foreground my-6 flex items-center font-medium">
            {{ text }}
          </div>
        </div>
        <VbenInputPassword
          v-model="formState.lockScreenPassword"
          :error-tip="$t('widgets.lockScreen.placeholder')"
          :label="$t('widgets.lockScreen.password')"
          :placeholder="$t('widgets.lockScreen.placeholder')"
          :status="passwordStatus"
          name="password"
          required
          type="password"
        />
        <VbenButton class="w-full" @click="handleSubmit">
          {{ $t('widgets.lockScreen.screenButton') }}
        </VbenButton>
      </div>
    </div>
  </Modal>
</template>
