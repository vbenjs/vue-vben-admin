import type { VxeUI } from '@vxe-ui/core';

import type { Ref } from 'vue';

import { watch } from 'vue';

import { defineLocaleAdapter } from '@vben/locales';

type Language = Parameters<typeof VxeUI.setLanguage>[0];
interface Selection {
  lang: string;
  messages: Parameters<typeof VxeUI.setI18n>[1];
}

let selected: Selection | undefined;
let standalone: Selection | undefined;
type Table = Pick<typeof VxeUI, 'setI18n' | 'setLanguage'>;
let table: Table | undefined;

function apply() {
  const selection = selected ?? standalone;
  if (table && selection) {
    // VXE accepts registered language IDs in addition to its built-in union.
    const lang = selection.lang as Language;
    table.setI18n(lang, selection.messages);
    table.setLanguage(lang);
  }
}

export const vxeLocaleAdapter = defineLocaleAdapter(
  () => selected,
  (selection) => {
    selected = selection;
    apply();
  },
  (
    { default: messages }: { default: NonNullable<Selection['messages']> },
    lang,
  ) => ({ lang, messages }),
);

export const vxeLocales = {
  'en-US': () => import('vxe-pc-ui/es/language/en-US'),
  'zh-CN': () => import('vxe-pc-ui/es/language/zh-CN'),
};

/** Called when the table is first imported, even if the language was selected earlier. */
export function bindVxeLocale(api: Table, locale: Readonly<Ref<string>>) {
  table = api;
  if (selected) {
    apply();
    return;
  }
  // Standalone tables have no application adapter to supply their dictionary.
  watch(
    locale,
    async (id, _, onCleanup) => {
      if (selected) return;
      let current = true;
      onCleanup(() => {
        current = false;
      });
      const lang = id === 'zh-CN' ? 'zh-CN' : 'en-US';
      const { default: messages } = await vxeLocales[lang]();
      if (current && !selected) {
        standalone = { lang, messages };
        apply();
      }
    },
    { immediate: true },
  );
}
