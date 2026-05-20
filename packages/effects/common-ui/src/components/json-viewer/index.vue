<script lang="ts" setup>
import type { SetupContext } from 'vue';

import type { Recordable } from '@vben/types';

import type {
  JsonViewerAction,
  JsonViewerProps,
  JsonViewerToggle,
  JsonViewerValue,
} from './types';

import { computed, ref, useAttrs } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

import { $t } from '@vben/locales';

import JsonBigint from 'json-bigint';

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
});

const emit = defineEmits<{
  click: [event: MouseEvent];
  copied: [event: JsonViewerAction];
  keyClick: [key: string];
  toggle: [param: JsonViewerToggle];
  valueClick: [value: JsonViewerValue];
}>();

const attrs: SetupContext['attrs'] = useAttrs();

const copiedPath = ref<null | string>(null);

const copyConfig = computed(() => {
  return {
    copiedText: $t('ui.jsonViewer.copied'),
    copyText: $t('ui.jsonViewer.copy'),
    timeout: 2000,
  };
});

function handleCopy(node: any, defaultCopy: () => void) {
  defaultCopy();
  copiedPath.value = node.path;
  emit('copied', {
    action: 'copy',
    text: JSON.stringify(node.content),
    trigger: node.el ?? document.body,
  });
  setTimeout(() => {
    if (copiedPath.value === node.path) {
      copiedPath.value = null;
    }
  }, copyConfig.value.timeout ?? 2000);
}

// 支持显示 bigint 数据，如较长的订单号
const jsonData = computed<Record<string, any>>(() => {
  if (typeof props.value !== 'string') {
    return props.value || {};
  }

  try {
    return JsonBigint({ storeAsString: true }).parse(props.value);
  } catch (error) {
    console.error('JSON parse error:', error);
    return {};
  }
});

const bindProps = computed<Recordable<any>>(() => {
  const prettyTheme =
    props.theme === 'dark' || props.theme === 'dark-json-theme'
      ? 'dark'
      : 'light';

  return {
    ...attrs,
    data: jsonData.value,
    deep: props.expanded ? Infinity : props.expandDepth,
    showDoubleQuotes: props.showDoubleQuotes,
    showLine: props.boxed,
    showLength: true,
    showIcon: true,
    theme: prettyTheme,
    collapsedNodeLength: props.previewMode ? 0 : Infinity,
    renderNodeActions: !!props.copyable,
  };
});
</script>
<template>
  <div :class="[props.theme, { boxed: props.boxed }]" class="vben-json-viewer">
    <VueJsonPretty v-bind="bindProps">
      <template #renderNodeActions="{ node, defaultActions }">
        <slot name="copy" :node="node" :default-actions="defaultActions">
          <span
            v-if="props.copyable"
            class="vben-json-copy-btn"
            :class="[{ 'is-copied': copiedPath === node.path }]"
            @click.stop="handleCopy(node, defaultActions.copy)"
          >
            {{
              copiedPath === node.path
                ? copyConfig.copiedText
                : copyConfig.copyText
            }}
          </span>
        </slot>
      </template>
    </VueJsonPretty>
  </div>
</template>
<style lang="scss">
@use './style.scss';
</style>
