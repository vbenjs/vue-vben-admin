<script setup lang="ts">
import { computed, toRaw, unref } from 'vue';

import { useSimpleLocale } from '@vben-core/composables';
import { VbenButton, VbenExpandableArrow } from '@vben-core/shadcn-ui';
import { cn, isFunction } from '@vben-core/shared/utils';

import { injectFormProps } from '../use-form-context';

const { $t } = useSimpleLocale();

const [rootProps, form] = injectFormProps();

const isExpanded = defineModel({ default: false });

const resetButtonOptions = computed(() => {
  return {
    show: true,
    text: `${$t.value('reset')}`,
    ...unref(rootProps).resetButtonOptions,
  };
});

const submitButtonOptions = computed(() => {
  return {
    show: true,
    text: `${$t.value('submit')}`,
    ...unref(rootProps).submitButtonOptions,
  };
});

async function handleSubmit(e: Event) {
  e?.preventDefault();
  const { valid } = await form.validate();
  if (!valid) {
    return;
  }
  await unref(rootProps).handleSubmit?.(toRaw(form.values));
}

async function handleReset(e: Event) {
  e?.preventDefault();
  const props = unref(rootProps);
  if (isFunction(props.handleReset)) {
    await props.handleReset?.(form.values);
  } else {
    form.resetForm();
  }
}
</script>
<template>
  <div
    :class="cn('ml-auto', rootProps.actionWrapperClass)"
    :style="{
      'grid-column': `-2 / -1`,
    }"
  >
    <VbenButton
      v-if="resetButtonOptions.show"
      class="mr-3"
      size="sm"
      variant="outline"
      @click="handleReset"
      v-bind="resetButtonOptions"
    >
      {{ resetButtonOptions.text }}
    </VbenButton>

    <VbenButton
      size="sm"
      variant="default"
      v-bind="submitButtonOptions"
      v-if="submitButtonOptions.show"
      @click="handleSubmit"
    >
      {{ submitButtonOptions.text }}
    </VbenButton>

    <VbenExpandableArrow
      v-if="rootProps.expandable"
      v-model:model-value="isExpanded"
      class="ml-2"
    >
      <span>{{ isExpanded ? $t('collapse') : $t('expand') }}</span>
    </VbenExpandableArrow>
  </div>
</template>
