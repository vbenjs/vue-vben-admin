import { createI18n } from 'vue-i18n';
import { ref, watch } from 'vue';
import type { I18nOptions } from 'vue-i18n';
export function useI18n(options?: I18nOptions) {
  const i18n = createI18n(options);

  const localeRef = ref(i18n.global.locale);

  watch(localeRef, () => {
    i18n.global.locale = localeRef.value as any;
  });
  return {
    t: i18n.global.t,
    localeRef,
  };
}
