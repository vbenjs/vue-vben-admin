<script setup lang="ts">
import { ref, useSlots } from 'vue';

import { Eye, EyeOff } from '@vben-core/icons';
import {
  type InputProps,
  VbenInput,
} from '@vben-core/shadcn-ui/components/input';

import { useForwardProps } from 'radix-vue';

import PasswordStrength from './password-strength.vue';

interface Props extends InputProps {}

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<Props>();

const modelValue = defineModel<string>();

const slots = useSlots();
const forward = useForwardProps(props);

const show = ref(false);
</script>

<template>
  <form class="relative">
    <VbenInput
      v-model="modelValue"
      v-bind="{ ...forward, ...$attrs }"
      :type="show ? 'text' : 'password'"
    >
      <template v-if="passwordStrength">
        <PasswordStrength :password="modelValue" />
        <p
          v-if="slots.strengthText"
          class="text-muted-foreground mt-1.5 text-xs"
        >
          <slot name="strengthText"> </slot>
        </p>
      </template>
    </VbenInput>
    <div
      class="hover:text-foreground text-foreground/60 absolute inset-y-0 right-0 top-3 flex cursor-pointer pr-3 text-lg leading-5"
      @click="show = !show"
    >
      <Eye v-if="show" class="size-4" />
      <EyeOff v-else class="size-4" />
    </div>
  </form>
</template>
