import type { App } from 'vue';

import type { LanguageOption } from '@vben-core/shared/constants';

import type { LocaleSetupOptions, LocaleUpdate } from './typing';

import { createI18n } from 'vue-i18n';

import { setCoreTranslator } from '@vben-core/composables';
import {
  connectLanguageRegistry,
  getSupportLanguages,
  SUPPORT_LANGUAGES,
} from '@vben-core/shared/constants';

import { createMessageLoader, overlayMessages } from './message-loaders';

const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: '',
  messages: {},
});
const loadShared = createMessageLoader(import.meta.glob('./langs/**/*.json'));
let options: LocaleSetupOptions = {};
let issuedId = 0;
let requestId = 0;
let initializing: Promise<void> | undefined;
let disconnect: (() => void) | undefined;

function defaultLocale() {
  return options.defaultLocale ?? 'zh-CN';
}

function fallbackChain(lang?: string) {
  return [
    ...new Set(
      [lang, options.fallbackLocale, defaultLocale()].filter(
        (id): id is string => !!id,
      ),
    ),
  ];
}

async function loadMessages(lang: string) {
  const [shared, app] = await Promise.all([
    loadShared(lang),
    options.loadMessages?.(lang),
  ]);
  if (!shared && (!app || Object.keys(app).length === 0)) {
    throw new Error(`No translation messages for locale "${lang}".`);
  }
  return overlayMessages(shared ?? {}, app ?? {});
}

function prepareAdapters(lang: string) {
  return Promise.all(
    Object.entries(options.adapters ?? {}).map(async ([name, adapter]) => {
      for (const id of fallbackChain(lang)) {
        const load = options.languages?.[id]?.resources?.[name];
        if (load) return adapter.prepare(load, id);
      }
      throw new Error(`Missing fallback for locale resource "${name}".`);
    }),
  );
}

function notify(callback?: () => Promise<void> | void) {
  try {
    Promise.resolve(callback?.()).catch((error) =>
      console.error('Locale notification failed:', error),
    );
  } catch (error) {
    console.error('Locale notification failed:', error);
  }
}

function commit(
  lang: string,
  messages: Awaited<ReturnType<typeof loadMessages>>,
  snapshots: Array<() => LocaleUpdate>,
  publish?: () => void,
) {
  const applied: LocaleUpdate[] = [];
  const updates = snapshots.map((snapshot) => snapshot());
  try {
    for (const update of updates) {
      // Include the failing adapter: its setter may throw after a partial write.
      applied.push(update);
      update.apply();
    }
    i18n.global.setLocaleMessage(lang, messages);
  } catch (error) {
    while (applied.length > 0) {
      try {
        applied.pop()?.restore();
      } catch (error_) {
        console.error('Locale rollback failed:', error_);
      }
    }
    throw error;
  }
  if (typeof document !== 'undefined') document.documentElement.lang = lang;
  i18n.global.locale.value = lang;
  publish?.();
  notify(() => options.onLocaleChanged?.(lang));
}

function preferredLanguage(list: LanguageOption[]) {
  const preferred =
    list.find(({ value }) => value === defaultLocale()) ?? list[0];
  if (!preferred) throw new Error('No supported languages configured.');
  return preferred.value;
}

async function initialize(app: App) {
  const list = getSupportLanguages();
  const allowed = list.map(({ value }) => value);
  const candidates = new Set([
    options.initialLocale,
    preferredLanguage(list),
    ...allowed,
  ]);
  const cache = new Map<string, ReturnType<typeof loadMessages>>();
  const loadOnce = (lang: string) => {
    const cached = cache.get(lang) ?? loadMessages(lang);
    cache.set(lang, cached);
    return cached;
  };
  for (const key of Object.keys(options.adapters ?? {})) {
    if (
      !fallbackChain().some((id) => options.languages?.[id]?.resources?.[key])
    ) {
      throw new Error(`Missing fallback for locale resource "${key}".`);
    }
  }
  // A hidden fallback may supply messages without ever being activated.
  const fallbacks: string[] = [];
  for (const lang of fallbackChain()) {
    try {
      i18n.global.setLocaleMessage(lang, await loadOnce(lang));
      fallbacks.push(lang);
    } catch (error) {
      console.warn(`Could not load fallback messages for "${lang}".`, error);
    }
  }
  i18n.global.fallbackLocale.value = fallbacks.length > 0 ? fallbacks : false;
  i18n.global.missingWarn = options.missingWarn ?? false;
  i18n.global.fallbackWarn = false;

  const failures: unknown[] = [];
  for (const lang of candidates) {
    if (!lang || !allowed.includes(lang)) continue;
    try {
      const [messages, updates] = await Promise.all([
        loadOnce(lang),
        prepareAdapters(lang),
      ]);
      commit(lang, messages, updates);
    } catch (error) {
      failures.push(error);
      console.warn(`Could not initialize locale "${lang}".`, error);
      continue;
    }
    setCoreTranslator({
      locale: () => i18n.global.locale.value,
      translate: (key) => i18n.global.t(key),
    });
    app.use(i18n);
    return;
  }
  throw new AggregateError(
    failures,
    'Could not initialize any allowed locale.',
  );
}

async function select(lang: string, id: number, publish?: () => void) {
  if (i18n.global.locale.value === lang) {
    publish?.();
    return true;
  }
  try {
    const [messages, updates] = await Promise.all([
      loadMessages(lang),
      prepareAdapters(lang),
    ]);
    if (id !== requestId) return false;
    commit(lang, messages, updates, publish);
    return true;
  } catch (error) {
    if (id !== requestId) return false;
    throw new Error(`Failed to change locale to "${lang}".`, {
      cause: error,
    });
  }
}

async function runLocaleRequest(
  run: (id: number) => boolean | Promise<boolean>,
  validate?: () => void,
) {
  const id = ++issuedId;
  const claim = () => {
    validate?.();
    requestId = Math.max(requestId, id);
  };
  // Let all queued requests validate against the initialized menu before
  // running the last valid one. A cancellation can also have a newer ID.
  if (initializing) await initializing.then(claim);
  else claim();
  return id === requestId && run(id);
}

async function setupI18n(app: App, setup: LocaleSetupOptions = {}) {
  if (initializing)
    throw new Error('Locale initialization is already in progress.');
  disconnect?.();
  cancelLocaleChange();
  options = setup;
  const defaults = setup.languages
    ? Object.entries(setup.languages).map(([value, { label }]) => ({
        value,
        label,
      }))
    : SUPPORT_LANGUAGES;
  // Queue selections made during bootstrap behind the initial commit.
  initializing = Promise.resolve().then(async () => {
    disconnect = connectLanguageRegistry(defaults, (list, publish) =>
      runLocaleRequest((id) => {
        if (!list.some(({ value }) => value === i18n.global.locale.value)) {
          return select(preferredLanguage(list), id, publish);
        }
        publish();
        return true;
      }),
    );
    await initialize(app);
  });
  try {
    await initializing;
  } catch (error) {
    disconnect?.();
    throw error;
  } finally {
    initializing = undefined;
  }
}

function cancelLocaleChange() {
  requestId = ++issuedId;
}

function changeLocale(
  lang: string,
  onApplied?: (locale: string) => void,
): Promise<boolean> {
  return runLocaleRequest(
    async (id) => {
      const applied = await select(lang, id);
      if (applied && id === requestId) notify(() => onApplied?.(lang));
      return applied;
    },
    () => {
      if (!getSupportLanguages().some(({ value }) => value === lang))
        throw new Error(`Unsupported locale "${lang}".`);
    },
  );
}

async function loadLocaleMessages(lang: string) {
  await changeLocale(lang);
}

export {
  cancelLocaleChange,
  changeLocale,
  i18n,
  loadLocaleMessages,
  setupI18n,
};
