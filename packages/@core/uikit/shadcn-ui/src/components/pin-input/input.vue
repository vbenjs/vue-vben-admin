<script setup lang="ts">
import type { PinInputProps } from './interface';

import { computed, ref, watch } from 'vue';

import { VbenButton } from '@vben-core/shadcn-ui/components/button';
import {
  PinInput,
  PinInputGroup,
  PinInputInput,
} from '@vben-core/shadcn-ui/components/ui/pin-input';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<PinInputProps>(), {
  btnLoading: false,
  codeLength: 6,
  handleSendCode: async () => {},
});

const emit = defineEmits<{
  complete: [];
}>();

const modelValue = defineModel<string>();

const inputValue = ref<string[]>([]);

const inputClass = computed(() => {
  if (props.status === 'error') {
    return 'border-destructive';
  }
  return '';
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
</script>

<template>
  <div class="relative mb-6">
    <label :for="name" class="mb-2 block text-sm font-medium">
      {{ label }}
    </label>
    <PinInput
      :id="name"
      v-model="inputValue"
      :class="inputClass"
      class="flex justify-between"
      otp
      placeholder="○"
      type="number"
      @complete="handleComplete"
    >
      <PinInputGroup>
        <PinInputInput
          v-for="(id, index) in codeLength"
          :key="id"
          :index="index"
        />
      </PinInputGroup>
      <VbenButton
        :loading="btnLoading"
        class="w-[300px] xl:w-full"
        size="lg"
        variant="outline"
        @click="handleSendCode"
      >
        {{ btnText }}
      </VbenButton>
    </PinInput>
    <p
      v-if="status === 'error'"
      class="text-destructive bottom-130 absolute mt-1 text-xs"
    >
      {{ errorTip }}
    </p>
  </div>
</template>
