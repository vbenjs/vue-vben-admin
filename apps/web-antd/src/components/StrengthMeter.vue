<script lang="ts" setup>
import { computed, ref, unref, watch, watchEffect } from 'vue';

import { useNamespace } from '@vben/hooks';

import { zxcvbn } from '@zxcvbn-ts/core';
import { Input } from 'ant-design-vue';

defineOptions({ name: 'StrengthMeter' });

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    placeholder?: string;
    showInput?: boolean;
    value: string;
  }>(),
  {
    disabled: false,
    placeholder: '',
    showInput: true,
    value: '',
  },
);

const emit = defineEmits(['scoreChange', 'change']);

const innerValueRef = ref('');
const { b, e } = useNamespace('strength-meter');

const getPasswordStrength = computed(() => {
  const { disabled } = props;
  if (disabled) return -1;
  const innerValue = unref(innerValueRef);
  const score = innerValue ? zxcvbn(unref(innerValueRef)).score : -1;
  emit('scoreChange', score);
  return score;
});

function handleChange(e: Event) {
  emit('change', (e.target as HTMLInputElement).value);
  innerValueRef.value = (e.target as HTMLInputElement).value;
}

watchEffect(() => {
  innerValueRef.value = props.value || '';
});

watch(
  () => unref(innerValueRef),
  (val) => {
    emit('change', val);
  },
);
</script>

<template>
  <div :class="[b()]" class="relative">
    <Input.Password
      v-if="showInput"
      v-bind="$attrs"
      :disabled="disabled"
      :placeholder="placeholder"
      :value="innerValueRef"
      allow-clear
      @change="handleChange"
    >
      <template v-for="item in Object.keys($slots)" #[item]="data">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </Input.Password>
    <div :class="e('bar')">
      <div :class="e('bar--fill')" :data-score="getPasswordStrength"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
