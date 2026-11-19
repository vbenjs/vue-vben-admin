import { computed, ref, shallowRef } from 'vue';

import { standaloneMessages } from './messages';

interface CoreTranslator {
  locale: () => string;
  translate: (key: string) => string;
}

const translator = shallowRef<CoreTranslator>();
const standaloneLocale = ref('zh-CN');
const currentLocale = computed(
  () => translator.value?.locale() ?? standaloneLocale.value,
);
const $t = computed(() => {
  if (translator.value) return translator.value.translate;
  const messages =
    standaloneMessages[currentLocale.value] ?? standaloneMessages['en-US'];
  return (key: string) => messages?.[key] ?? key;
});

/** Also available to dialogs rendered outside the application's component tree. */
export function setCoreTranslator(source?: CoreTranslator) {
  translator.value = source;
}

export function useSimpleLocale() {
  return {
    $t,
    currentLocale,
    setSimpleLocale: (lang: string) => {
      standaloneLocale.value = lang;
    },
  };
}
