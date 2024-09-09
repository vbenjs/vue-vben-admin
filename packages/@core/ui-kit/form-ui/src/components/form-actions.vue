<script setup lang="ts">
import { computed, toRaw, unref } from 'vue';

import { useSimpleLocale } from '@vben-core/composables';
import { VbenButton, VbenExpandableArrow } from '@vben-core/shadcn-ui';
import { cn, isFunction } from '@vben-core/shared/utils';

import { injectFormProps } from '../use-form-context';

const { $t } = useSimpleLocale();

const [rootProps, form] = injectFormProps();

const collapsed = defineModel({ default: false });

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

const isQueryForm = computed(() => {
  return !!unref(rootProps).showCollapseButton;
});

const queryFormStyle = computed(() => {
  if (isQueryForm.value) {
    return {
      'grid-column': `-2 / -1`,
      marginLeft: 'auto',
    };
  }

  return {};
});

async function handleSubmit(e: Event) {
  e?.preventDefault();
  e?.stopPropagation();
  const { valid } = await form.validate();
  if (!valid) {
    return;
  }
  await unref(rootProps).handleSubmit?.(toRaw(form.values));
}

async function handleReset(e: Event) {
  e?.preventDefault();
  e?.stopPropagation();
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
    :class="cn('col-span-full w-full text-right', rootProps.actionWrapperClass)"
    :style="queryFormStyle"
  >
    <VbenButton
      v-if="resetButtonOptions.show"
      class="mr-3"
      size="sm"
      type="button"
      variant="outline"
      @click="handleReset"
      v-bind="resetButtonOptions"
    >
      {{ resetButtonOptions.text }}
    </VbenButton>

    <VbenButton
      size="sm"
      type="button"
      variant="default"
      v-bind="submitButtonOptions"
      v-if="submitButtonOptions.show"
      @click="handleSubmit"
    >
      {{ submitButtonOptions.text }}
    </VbenButton>

    <VbenExpandableArrow
      v-if="rootProps.showCollapseButton"
      v-model:model-value="collapsed"
      class="ml-2"
    >
      <span>{{ collapsed ? $t('expand') : $t('collapse') }}</span>
    </VbenExpandableArrow>
  </div>
</template>
