<script setup lang="ts">
import type { RegisterEmits } from './typings';

import { computed, reactive } from 'vue';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  VbenAvatar,
  VbenButton,
  VbenInputPassword,
} from '@vben-core/shadcn-ui';

interface Props {
  avatar?: string;
  text?: string;
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
const openModal = defineModel<boolean>('open');
const passwordStatus = computed(() => {
  return formState.submitted && !formState.lockScreenPassword
    ? 'error'
    : 'default';
});

function handleClose() {
  openModal.value = false;
}

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
  <div>
    <Dialog :open="openModal">
      <DialogContent
        class="top-0 h-full w-full -translate-y-0 border-none p-0 shadow-xl sm:top-[20%] sm:h-[unset] sm:w-[600px] sm:rounded-2xl"
        @close="handleClose"
      >
        <DialogDescription />
        <DialogHeader>
          <DialogTitle
            class="border-border flex h-8 items-center px-5 font-normal"
          >
            {{ $t('widgets.lockScreen.title') }}
          </DialogTitle>
        </DialogHeader>
        <div
          class="mb-10 flex w-full flex-col items-center"
          @keypress.enter.prevent="handleSubmit"
        >
          <div class="w-2/3">
            <div class="ml-2 flex w-full flex-col items-center">
              <VbenAvatar
                :src="avatar"
                class="size-24"
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
      </DialogContent>
    </Dialog>
  </div>
</template>
