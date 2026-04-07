import type { MaybeRefOrGetter } from 'vue';

import { computed } from 'vue';

import { usePageSchema } from '#/composables/usePageSchema';

const EMPTY_POLICY = {
  actions: {},
  attachments: {},
  fields: {},
  print: {},
};

export function useRuntimePageConfig(
  pageCode: MaybeRefOrGetter<string>,
  options: Record<string, any> = {},
) {
  const { loading, refresh, runtime, schema } = usePageSchema(pageCode, options);
  const policy = computed(() => runtime.value?.policy || EMPTY_POLICY);
  const context = computed(() => runtime.value?.context || {});
  const versions = computed(() => runtime.value?.versions || {});
  const sources = computed(() => runtime.value?.sources || {});

  const resolveFieldPolicy = (key: string) => policy.value.fields?.[key] || {};
  const resolveActionPolicy = (key: string) => policy.value.actions?.[key] || {};
  const resolveAttachmentPolicy = (key: string) =>
    policy.value.attachments?.[key] || {};

  return {
    context,
    loading,
    policy,
    refresh,
    resolveActionPolicy,
    resolveAttachmentPolicy,
    resolveFieldPolicy,
    runtime,
    schema,
    sources,
    versions,
  };
}
