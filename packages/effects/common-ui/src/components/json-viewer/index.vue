<script lang="ts" setup>
import type { SetupContext } from 'vue';

import type { Recordable } from '@vben/types';

import type { JsonViewerProps } from './types';

import { computed, useAttrs } from 'vue';
// @ts-ignore
import VueJsonViewer from 'vue-json-viewer';

import { $t } from '@vben/locales';

import { isBoolean, isString } from '@vben-core/shared/utils';

defineOptions({ name: 'JsonViewer' });

const props = withDefaults(defineProps<JsonViewerProps>(), {
  expandDepth: 1,
  copyable: false,
  sort: false,
  boxed: false,
  theme: 'default-json-theme',
  expanded: false,
  previewMode: false,
  showArrayIndex: true,
  showDoubleQuotes: false,
  parseString: true,
});

const emit = defineEmits<{
  parseError: [error: Error];
}>();

const attrs: SetupContext['attrs'] = useAttrs();

const bindProps = computed<Recordable<any>>(() => {
  const copyable = {
    copyText: $t('ui.jsonViewer.copy'),
    copiedText: $t('ui.jsonViewer.copied'),
    timeout: 2000,
    ...(isBoolean(props.copyable) ? {} : props.copyable),
  };

  return {
    ...props,
    ...attrs,
    copyable: props.copyable ? copyable : false,
  };
});

const modelValue = defineModel();

const jsonToShow = computed(() => {
  if (props.parseString && isString(modelValue.value)) {
    try {
      return JSON.parse(modelValue.value);
    } catch (error) {
      emit('parseError', error as Error);
      console.error('Error parsing JSON:', error);
      return modelValue.value;
    }
  } else {
    return modelValue.value;
  }
});
</script>
<template>
  <VueJsonViewer :value="jsonToShow" v-bind="bindProps">
    <template #copy="slotProps">
      <slot name="copy" v-bind="slotProps"></slot>
    </template>
  </VueJsonViewer>
</template>
<style lang="scss">
@use './style.scss';
</style>
