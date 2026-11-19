import type { LoadMessageFn, LocaleAdapter, ResourceLoader } from './typing';

import { shallowRef } from 'vue';

type Resources<A> = {
  [K in keyof A]?: A[K] extends LocaleAdapter<infer T>
    ? ResourceLoader<T>
    : never;
};

/** Infer locale IDs from the menu and resource types from their adapters. */
export function defineLocaleConfig<
  L extends string,
  A extends Record<string, LocaleAdapter>,
>(config: {
  adapters: A;
  fallbackLocale?: NoInfer<L>;
  languages: Record<L, { label: string; resources?: Resources<NoInfer<A>> }>;
  loadMessages?: LoadMessageFn;
}) {
  return config;
}

export function defineLocaleAdapter<T, S>(
  read: () => S,
  write: (state: S) => void,
  resolve: (resource: T, lang: string) => S,
): LocaleAdapter<T> {
  return {
    async prepare(load, lang) {
      const next = resolve(await load(), lang);
      return () => {
        const previous = read();
        return { apply: () => write(next), restore: () => write(previous) };
      };
    },
  };
}

/** Component providers consume a ref; Vite locale modules have a default export. */
export function createUiLocale<T>() {
  const locale = shallowRef<T>();
  const adapter = defineLocaleAdapter(
    () => locale.value,
    (value) => {
      locale.value = value;
    },
    (module: { default: T }) => module.default,
  );
  return { adapter, locale };
}

export function createDayjsLocale(locale: (name?: string) => string) {
  return defineLocaleAdapter(
    () => locale(),
    (name) => {
      locale(name);
    },
    (module: { default: { name: string } }) => module.default.name,
  );
}
