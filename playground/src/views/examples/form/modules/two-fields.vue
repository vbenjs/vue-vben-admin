<script lang="ts" setup>
import type { SelectValue } from 'antdv-next';

import { Input, Select } from 'antdv-next';

const emit = defineEmits(['blur']);

const modelValue = defineModel<[string | undefined, string | undefined]>({
  default: () => [undefined, undefined],
});

function handlePhoneChange(value: string | undefined) {
  modelValue.value = [modelValue.value[0], value];
}

function handleTypeChange(value: SelectValue) {
  modelValue.value = [
    typeof value === 'string' ? value : undefined,
    modelValue.value[1],
  ];
}
</script>
<template>
  <div class="flex w-full gap-1">
    <Select
      :value="modelValue[0]"
      class="w-20"
      placeholder="类型"
      allow-clear
      :class="{ 'valid-success': !!modelValue[0] }"
      :options="[
        { label: '个人', value: 'personal' },
        { label: '工作', value: 'work' },
        { label: '私密', value: 'private' },
      ]"
      @blur="emit('blur')"
      @update:value="handleTypeChange"
    />
    <Input
      placeholder="请输入11位手机号码"
      class="flex-1"
      allow-clear
      :class="{ 'valid-success': modelValue[1]?.match(/^1[3-9]\d{9}$/) }"
      :value="modelValue[1]"
      :maxlength="11"
      type="tel"
      @blur="emit('blur')"
      @update:value="handlePhoneChange"
    />
  </div>
</template>
