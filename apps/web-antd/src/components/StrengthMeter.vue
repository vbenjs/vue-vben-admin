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
      <div :class="e('bar__fill')" :data-score="getPasswordStrength"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
/*
 todo: 这里的颜色最好也提取到 @vben-core/design 下中
  */
@import '@vben/styles/global';

@include b('strength-meter') {
  @include e('bar') {
    position: relative;
    height: 6px;
    margin: 10px auto 6px;
    background-color: rgb(0 0 0 / 25%);
    border-radius: 6px;

    @include e('fill') {
      position: absolute;
      width: 0;
      height: inherit;
      background-color: transparent;
      border-radius: inherit;
      transition:
        width 0.5s ease-in-out,
        background 0.25s;

      &[data-score='0'] {
        width: 20%;
        background-color: #e74242;
      }

      &[data-score='1'] {
        width: 40%;
        background-color: #ed6f6f;
      }

      &[data-score='2'] {
        width: 60%;
        background-color: #efbd47;
      }

      &[data-score='3'] {
        width: 80%;
        background-color: rgb(85 209 135 / 50%);
      }

      &[data-score='4'] {
        width: 100%;
        background-color: #55d187;
      }
    }

    &::before,
    &::after {
      position: absolute;
      z-index: 10;
      display: block;
      width: 20%;
      height: inherit;
      content: '';
      background-color: transparent;
      border-color: white;
      border-style: solid;
      border-width: 0 5px;
    }

    &::before {
      left: 20%;
    }

    &::after {
      right: 20%;
    }
  }
}
</style>
