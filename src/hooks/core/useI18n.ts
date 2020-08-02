import VueI18n from 'vue-i18n';

import { ref, watch, Vue } from 'compatible-vue';
export function createI18n(options?: VueI18n.I18nOptions) {
  Vue.use(VueI18n);
  const i18n = new VueI18n(options);

  const vm = new Vue({
    i18n,
  });

  const localeRef = ref(i18n.locale);

  watch(localeRef, () => {
    i18n.locale = localeRef.value;
  });

  return () => ({
    localeRef,
    t: vm.$t.bind(vm),
    tc: vm.$tc.bind(vm),
    d: vm.$d.bind(vm),
    te: vm.$te.bind(vm),
  });
}

export function useI18n(options?: VueI18n.I18nOptions) {
  return createI18n(options)();
}
