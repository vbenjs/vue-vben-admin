<script setup lang="ts">
import { Button, Input } from 'ant-design-vue';

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    readonly?: boolean;
    triggerText?: string;
  }>(),
  {
    placeholder: '',
    readonly: false,
    triggerText: '...',
  },
);

const emit = defineEmits<{
  trigger: [];
}>();

const model = defineModel<string | undefined>('value', { default: '' });
</script>

<template>
  <Input
    v-model:value="model"
    :placeholder="props.placeholder"
    :readonly="props.readonly"
    class="legacy-picker-input"
  >
    <template #addonAfter>
      <Button
        class="legacy-picker-input__trigger"
        type="text"
        @click="emit('trigger')"
      >
        {{ props.triggerText }}
      </Button>
    </template>
  </Input>
</template>
