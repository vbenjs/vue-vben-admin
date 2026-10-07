<script lang="ts" setup>
import { useCustomFieldValue } from '@vben/common-ui';

import { CheckableTag } from 'antdv-next';

const options = ['前端', '后端', '运维', '测试'];

// 值归表单所有：表单通过 componentProps 的 modelValue 下发，组件只负责 emit 回去，
// 所以 setValues、重置能顺着 props 流回来，组件里不必再存一份选中项
const modelValue = defineModel<string[]>({ default: () => [] });

// 选中项不落在单个原生控件上，靠 useCustomFieldValue 把它交给表单项做校验
const { disabled } = useCustomFieldValue(() => modelValue.value);

function toggle(option: string, checked: boolean) {
  if (disabled.value) {
    return;
  }
  modelValue.value = checked
    ? [...modelValue.value, option]
    : modelValue.value.filter((item) => item !== option);
}
</script>

<template>
  <div class="flex w-full items-center gap-1">
    <CheckableTag
      v-for="option in options"
      :key="option"
      :checked="modelValue.includes(option)"
      :disabled="disabled"
      @update:checked="(checked: boolean) => toggle(option, checked)"
    >
      {{ option }}
    </CheckableTag>
  </div>
</template>
