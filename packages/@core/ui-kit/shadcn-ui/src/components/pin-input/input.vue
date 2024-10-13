<script setup lang="ts">
import type { PinInputProps } from './types';

import { computed, onBeforeUnmount, ref, useId, watch } from 'vue';

import { PinInput, PinInputGroup, PinInputInput } from '../../ui';
import { VbenButton } from '../button';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<PinInputProps>(), {
  btnLoading: false,
  codeLength: 6,
  handleSendCode: async () => {},
  maxTime: 60,
});

const emit = defineEmits<{
  complete: [];
}>();

const timer = ref<ReturnType<typeof setTimeout>>();

const modelValue = defineModel<string>();

const inputValue = ref<string[]>([]);
const countdown = ref(0);

const btnText = computed(() => {
  const countdownValue = countdown.value;
  return props.createText?.(countdownValue);
});

const btnLoading = computed(() => {
  return props.loading || countdown.value > 0;
});

watch(
  () => modelValue.value,
  () => {
    inputValue.value = modelValue.value?.split('') ?? [];
  },
);

function handleComplete(e: string[]) {
  modelValue.value = e.join('');
  emit('complete');
}

async function handleSend(e: Event) {
  e?.preventDefault();
  await props.handleSendCode();
  countdown.value = props.maxTime;
  startCountdown();
}

function startCountdown() {
  if (countdown.value > 0) {
    timer.value = setTimeout(() => {
      countdown.value--;
      startCountdown();
    }, 1000);
  }
}

onBeforeUnmount(() => {
  countdown.value = 0;
  clearTimeout(timer.value);
});

const id = useId();
</script>

<template>
  <PinInput
    :id="id"
    v-model="inputValue"
    class="flex w-full justify-between"
    otp
    placeholder="○"
    type="number"
    @complete="handleComplete"
  >
    <div class="relative flex w-full">
      <PinInputGroup class="mr-2">
        <PinInputInput
          v-for="(item, index) in codeLength"
          :key="item"
          :index="index"
        />
      </PinInputGroup>
      <VbenButton
        :loading="btnLoading"
        class="flex-grow"
        size="lg"
        variant="outline"
        @click="handleSend"
      >
        {{ btnText }}
      </VbenButton>
    </div>
  </PinInput>
</template>
