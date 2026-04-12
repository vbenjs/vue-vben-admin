<script setup lang="ts">
import type {
  CustomPreferencesField,
  CustomPreferencesRecord,
} from '@vben/preferences';

import { computed } from 'vue';

import { $t } from '@vben/locales';

import InputItem from '../input-item.vue';
import NumberFieldItem from '../number-field-item.vue';
import SelectItem from '../select-item.vue';
import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceCustomFields',
});

const props = defineProps<{
  fields: Array<CustomPreferencesField>;
  values: CustomPreferencesRecord;
}>();

const emit = defineEmits<{
  update: [updates: CustomPreferencesRecord];
}>();

function handleUpdate(key: string, value: boolean | number | string) {
  emit('update', { [key]: value });
}

function handleBooleanUpdate(key: string, value: boolean | undefined) {
  handleUpdate(key, value ?? false);
}

function resolveNumberValue(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined;
}

function handleNumberUpdate(key: string, value: number | undefined) {
  const resolvedValue = resolveNumberValue(value);

  if (resolvedValue !== undefined) {
    handleUpdate(key, resolvedValue);
  }
}

function handleStringUpdate(key: string, value: string | undefined) {
  handleUpdate(key, value ?? '');
}

const resolvedFields = computed(() => {
  return props.fields.map((field) => {
    return {
      ...field,
      label: $t(field.label),
      options:
        field.component === 'select'
          ? field.options.map((option) => ({
              ...option,
              label: $t(option.label),
            }))
          : undefined,
      placeholder: field.placeholder ? $t(field.placeholder) : '',
      tip: field.tip ? $t(field.tip) : '',
    };
  });
});
</script>

<template>
  <template v-for="field in resolvedFields" :key="field.key">
    <SwitchItem
      v-if="field.component === 'switch'"
      :disabled="field.disabled"
      :model-value="Boolean(values[field.key])"
      :tip="field.tip"
      v-bind="field.componentProps"
      @update:model-value="handleBooleanUpdate(field.key, $event)"
    >
      {{ field.label }}
    </SwitchItem>
    <NumberFieldItem
      v-else-if="field.component === 'number'"
      :disabled="field.disabled"
      :model-value="resolveNumberValue(values[field.key])"
      :placeholder="field.placeholder"
      :tip="field.tip"
      v-bind="field.componentProps"
      @update:model-value="handleNumberUpdate(field.key, $event)"
    >
      {{ field.label }}
    </NumberFieldItem>
    <SelectItem
      v-else-if="field.component === 'select'"
      :disabled="field.disabled"
      :items="field.options"
      :model-value="String(values[field.key] ?? '')"
      :placeholder="field.placeholder"
      :tip="field.tip"
      v-bind="field.componentProps"
      @update:model-value="handleStringUpdate(field.key, $event)"
    >
      {{ field.label }}
    </SelectItem>
    <InputItem
      v-else
      :disabled="field.disabled"
      :model-value="String(values[field.key] ?? '')"
      :placeholder="field.placeholder"
      :tip="field.tip"
      v-bind="field.componentProps"
      @update:model-value="handleStringUpdate(field.key, $event)"
    >
      {{ field.label }}
    </InputItem>
  </template>
</template>
