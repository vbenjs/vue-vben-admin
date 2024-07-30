<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from 'vue';

import { LockKeyhole } from '@vben/icons';
import { $t, useI18n } from '@vben/locales';
import { storeToRefs, useLockStore } from '@vben/stores';
import {
  VbenAvatar,
  VbenButton,
  VbenInputPassword,
} from '@vben-core/shadcn-ui';

import { useDateFormat, useNow } from '@vueuse/core';

interface Props {
  avatar?: string;
}

defineOptions({
  name: 'LockScreen',
});

withDefaults(defineProps<Props>(), {
  avatar: '',
});

defineEmits<{ toLogin: [] }>();

const { locale } = useI18n();
const lockStore = useLockStore();

const now = useNow();
const meridiem = useDateFormat(now, 'A');
const hour = useDateFormat(now, 'HH');
const minute = useDateFormat(now, 'mm');
const date = useDateFormat(now, 'YYYY-MM-DD dddd', { locales: locale.value });

const showUnlockForm = ref(false);
const validPass = ref(true);
const { lockScreenPassword } = storeToRefs(lockStore);

const formState = reactive({
  password: '',
  submitted: false,
});

const passwordStatus = computed(() => {
  if (formState.submitted && !formState.password) {
    return 'error';
  }

  if (formState.submitted && !validPass.value) {
    return 'error';
  }

  return 'default';
});

const errorTip = computed(() => {
  return lockScreenPassword?.value === undefined || !formState.password
    ? $t('widgets.lockScreen.placeholder')
    : $t('widgets.lockScreen.errorPasswordTip');
});

watchEffect(() => {
  if (!formState.password) {
    validPass.value = true;
  }
});

function handleSubmit() {
  formState.submitted = true;
  if (passwordStatus.value !== 'default') {
    return;
  }
  if (lockScreenPassword?.value !== formState.password) {
    validPass.value = false;
    return;
  }
  lockStore.unlockScreen();
}

function toggleUnlockForm() {
  showUnlockForm.value = !showUnlockForm.value;
}
</script>

<template>
  <div class="bg-background fixed z-[2000] size-full">
    <transition name="slide-left">
      <div v-show="!showUnlockForm" class="size-full">
        <div
          class="flex-col-center text-foreground/80 hover:text-foreground group my-4 cursor-pointer text-xl font-semibold"
          @click="toggleUnlockForm"
        >
          <LockKeyhole
            class="size-5 transition-all duration-300 group-hover:scale-125"
          />
          <span>{{ $t('widgets.lockScreen.unlock') }}</span>
        </div>
        <div class="flex h-full justify-center px-[10%]">
          <div
            class="bg-accent flex-center relative mb-14 mr-20 h-4/5 w-2/5 flex-auto rounded-3xl text-center text-[260px]"
          >
            <span class="absolute left-4 top-4 text-xl font-semibold">
              {{ meridiem }}
            </span>
            {{ hour }}
          </div>
          <div
            class="bg-accent flex-center mb-14 h-4/5 w-2/5 flex-auto rounded-3xl text-center text-[260px]"
          >
            {{ minute }}
          </div>
        </div>
      </div>
    </transition>

    <transition name="slide-right">
      <div
        v-if="showUnlockForm"
        class="flex-center size-full"
        @keypress.enter.prevent="handleSubmit"
      >
        <div class="flex-col-center mb-10 w-[300px]">
          <VbenAvatar :src="avatar" class="enter-x mb-6 size-20" />
          <div class="enter-x mb-2 w-full items-center">
            <VbenInputPassword
              v-model="formState.password"
              :autofocus="true"
              :error-tip="errorTip"
              :label="$t('widgets.lockScreen.password')"
              :placeholder="$t('widgets.lockScreen.placeholder')"
              :status="passwordStatus"
              name="password"
              required
              type="password"
            />
          </div>
          <VbenButton class="enter-x w-full" @click="handleSubmit">
            {{ $t('widgets.lockScreen.entry') }}
          </VbenButton>
          <VbenButton
            class="enter-x my-2 w-full"
            variant="ghost"
            @click="$emit('toLogin')"
          >
            {{ $t('widgets.lockScreen.backToLogin') }}
          </VbenButton>
          <VbenButton
            class="enter-x mr-2 w-full"
            variant="ghost"
            @click="toggleUnlockForm"
          >
            {{ $t('common.back') }}
          </VbenButton>
        </div>
      </div>
    </transition>

    <div
      class="enter-y absolute bottom-5 w-full text-center text-gray-300 xl:text-xl 2xl:text-3xl"
    >
      <div v-if="showUnlockForm" class="enter-x mb-2 text-3xl">
        {{ hour }}:{{ minute }} <span class="text-lg">{{ meridiem }}</span>
      </div>
      <div class="text-3xl">{{ date }}</div>
    </div>
  </div>
</template>
