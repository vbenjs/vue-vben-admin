import { createApp } from 'vue';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createUiLocale, defineLocaleAdapter } from './locale-configs';

// Each case represents a separate application, including its pre-bootstrap registry.
beforeEach(() => {
  vi.resetModules();
});

async function runtime() {
  const [locale, registry] = await Promise.all([
    import('./i18n'),
    import('@vben-core/shared/constants'),
  ]);
  return { ...locale, ...registry };
}

const menu = (value: string) => ({ label: value, value });
const createHost = () => createApp({});
const resource = (value: string) => async () => ({ default: value });

describe('application locales', () => {
  it('uses the same app overlay for core UI and the composer, including a cold, hidden fallback', async () => {
    const app = await runtime();
    const core = await import('@vben-core/composables');
    const button = core.useSimpleLocale().$t;
    const ui = createUiLocale<string>();
    const dates = createUiLocale<string>();
    const table = createUiLocale<string>();
    await app.setSupportLanguages([menu('fr-FR'), menu('en-US')]);
    await app.setupI18n(createHost(), {
      initialLocale: 'fr-FR',
      fallbackLocale: 'zh-TW',
      adapters: { ui: ui.adapter, dates: dates.adapter, table: table.adapter },
      languages: {
        'fr-FR': { label: 'French', resources: { ui: resource('fr') } },
        'zh-TW': {
          label: 'Chinese',
          resources: {
            ui: resource('tw'),
            dates: resource('tw'),
            table: resource('tw'),
          },
        },
        'en-US': {
          label: 'English',
          resources: { dates: resource('en'), table: resource('en') },
        },
      },
      loadMessages: async (lang) => {
        if (lang === 'fr-FR')
          return {
            common: { cancel: 'Annuler' },
            authentication: { welcomeBack: 'Bienvenue' },
          };
        if (lang === 'zh-TW') return { common: { submit: '送出' } };
        return undefined;
      },
    });
    expect(app.getSupportLanguages()).toEqual([menu('fr-FR'), menu('en-US')]);
    expect(button.value('common.cancel')).toBe('Annuler');
    expect(button.value('common.submit')).toBe('送出');
    expect(app.i18n.global.t('authentication.welcomeBack')).toBe('Bienvenue');
    expect([ui.locale.value, dates.locale.value, table.locale.value]).toEqual([
      'fr',
      'tw',
      'tw',
    ]);
    await app.changeLocale('en-US');
    await app.changeLocale('fr-FR');
    expect([ui.locale.value, dates.locale.value, table.locale.value]).toEqual([
      'fr',
      'tw',
      'tw',
    ]);
  });

  it('uses only the new setup dictionaries before and after the default locale recovers', async () => {
    const app = await runtime();
    const key = 'common.default-only';
    await app.setupI18n(createHost(), {
      loadMessages: async () => ({
        common: { 'default-only': 'Previous app' },
      }),
    });
    expect(app.i18n.global.t(key)).toBe('Previous app');

    let offline = true;
    await app.setupI18n(createHost(), {
      async loadMessages(lang) {
        if (lang !== 'zh-CN') return undefined;
        if (offline) throw new Error('Offline');
        return { common: { 'default-only': 'Recovered' } };
      },
    });
    expect(app.i18n.global.locale.value).toBe('en-US');
    expect(app.i18n.global.t(key)).toBe(key);
    offline = false;
    expect(await app.changeLocale('zh-CN')).toBe(true);
    expect(await app.changeLocale('en-US')).toBe(true);
    expect(app.i18n.global.locale.value).toBe('en-US');
    expect(app.i18n.global.t(key)).toBe('Recovered');
  });

  it('uses an explicit pre-bootstrap list even when equal to the built-in menu', async () => {
    const app = await runtime();
    await app.setSupportLanguages(app.SUPPORT_LANGUAGES);
    await app.setupI18n(createHost(), {
      languages: { 'zh-TW': { label: 'Chinese' } },
      initialLocale: 'removed',
      defaultLocale: 'en-US',
    });
    expect(app.getSupportLanguages()).toEqual(app.SUPPORT_LANGUAGES);
    expect(document.documentElement.lang).toBe('en-US');
  });

  it('publishes a replacement menu only after its allowed locale succeeds', async () => {
    const app = await runtime();
    const changed = vi.fn();
    const load = vi.fn(async (lang: string) => {
      if (lang === 'offline') throw new Error('Offline');
      if (lang === 'remote') return { common: { cancel: 'Remote' } };
      return undefined;
    });
    await app.setupI18n(createHost(), {
      initialLocale: 'en-US',
      loadMessages: load,
      onLocaleChanged: changed,
    });
    const original = app.getSupportLanguages();
    await expect(app.setSupportLanguages([menu('offline')])).rejects.toThrow(
      'offline',
    );
    await expect(app.setSupportLanguages([])).rejects.toThrow('non-empty');
    await expect(
      app.setSupportLanguages([menu('en-US'), menu('en-US')]),
    ).rejects.toThrow('unique');
    expect(app.getSupportLanguages()).toEqual(original);
    expect(document.documentElement.lang).toBe('en-US');
    expect(changed).toHaveBeenCalledTimes(1);
    await app.setSupportLanguages([menu('remote'), menu('zh-CN')]);
    expect(changed).toHaveBeenLastCalledWith('zh-CN');
    await app.setSupportLanguages([menu('remote')]);
    expect(app.i18n.global.t('common.cancel')).toBe('Remote');
    expect(changed).toHaveBeenLastCalledWith('remote');
    const calls = load.mock.calls.length;
    await app.setSupportLanguages([{ value: 'remote', label: 'New label' }]);
    expect(load).toHaveBeenCalledTimes(calls);
  });

  it('invalidates both an older selection and a pending menu replacement on reselect', async () => {
    const app = await runtime();
    const pending = Promise.withResolvers<{ default: string }>();
    const ui = createUiLocale<string>();
    await app.setupI18n(createHost(), {
      adapters: { ui: ui.adapter },
      languages: {
        'en-US': { label: 'English', resources: { ui: () => pending.promise } },
        'zh-CN': { label: 'Chinese', resources: { ui: resource('zh') } },
      },
    });
    const switchLanguage = app.changeLocale('en-US');
    const replace = app.setSupportLanguages([menu('en-US')]);
    expect(await app.changeLocale('zh-CN')).toBe(true);
    pending.resolve({ default: 'en' });
    expect(await switchLanguage).toBe(false);
    expect(await replace).toBe(false);
    expect(ui.locale.value).toBe('zh');
    expect(app.getSupportLanguages()).toHaveLength(2);
  });

  it('does not report a committed switch as cancelled when its observer switches again', async () => {
    const app = await runtime();
    let next: Promise<boolean> | undefined;
    await app.setupI18n(createHost(), {
      onLocaleChanged(locale) {
        if (locale === 'en-US') next = app.changeLocale('zh-CN');
      },
    });
    expect(await app.changeLocale('en-US')).toBe(true);
    expect(await next).toBe(true);
    expect(document.documentElement.lang).toBe('zh-CN');
  });

  it('processes requests from adapter writers against the committed locale and menu', async () => {
    const app = await runtime();
    const applied = vi.fn();
    let nested: Promise<boolean> | undefined;
    const writer = defineLocaleAdapter(
      () => app.i18n.global.locale.value,
      (lang) => {
        if (lang === 'en-US') {
          nested = app.changeLocale('zh-CN', () =>
            applied(app.i18n.global.locale.value),
          );
        }
      },
      (lang: string) => lang,
    );
    await app.setupI18n(createHost(), {
      adapters: { writer },
      languages: {
        'zh-CN': {
          label: 'Chinese',
          resources: { writer: async () => 'zh-CN' },
        },
        'en-US': {
          label: 'English',
          resources: { writer: async () => 'en-US' },
        },
      },
    });
    expect(await app.changeLocale('en-US')).toBe(true);
    expect(await nested).toBe(true);
    expect(applied).toHaveBeenCalledExactlyOnceWith('zh-CN');
    expect(app.i18n.global.locale.value).toBe('zh-CN');

    expect(await app.setSupportLanguages([menu('en-US')])).toBe(true);
    await expect(nested).rejects.toThrow('Unsupported locale "zh-CN"');
    expect(applied).toHaveBeenCalledTimes(1);
    expect(app.i18n.global.locale.value).toBe('en-US');
  });

  it.each(['selection', 'menu'])(
    'does not cancel a pending %s for an unsupported locale',
    async (operation) => {
      const app = await runtime();
      const pending = Promise.withResolvers<undefined>();
      await app.setupI18n(createHost(), {
        async loadMessages(lang) {
          if (lang === 'en-US') await pending.promise;
          return undefined;
        },
      });
      const change =
        operation === 'menu'
          ? app.setSupportLanguages([menu('en-US')])
          : app.changeLocale('en-US');
      await expect(app.changeLocale('unknown')).rejects.toThrow(
        'Unsupported locale',
      );
      pending.resolve(undefined);
      expect(await change).toBe(true);
      expect(app.i18n.global.locale.value).toBe('en-US');
      const expectedMenu =
        operation === 'menu' ? [menu('en-US')] : app.SUPPORT_LANGUAGES;
      expect(app.getSupportLanguages()).toEqual(expectedMenu);
    },
  );

  it('returns false for a cancelled startup request even if the menu excludes it', async () => {
    const app = await runtime();
    const startup = app.setupI18n(createHost(), {
      languages: { 'zh-CN': menu('zh-CN'), 'zh-TW': menu('zh-TW') },
    });
    const queued = app.changeLocale('en-US');
    app.cancelLocaleChange();
    await startup;
    expect(await queued).toBe(false);
    expect(app.i18n.global.locale.value).toBe('zh-CN');
  });

  it('chooses the last valid request queued before the startup menu is installed', async () => {
    const app = await runtime();
    const startup = app.setupI18n(createHost(), {
      languages: { 'zh-CN': menu('zh-CN'), 'zh-TW': menu('zh-TW') },
    });
    const first = app.changeLocale('zh-CN');
    const last = app.changeLocale('zh-TW');
    await expect(app.changeLocale('en-US')).rejects.toThrow(
      'Unsupported locale',
    );
    await startup;
    expect(await first).toBe(false);
    expect(await last).toBe(true);
    expect(app.i18n.global.locale.value).toBe('zh-TW');
  });

  it('does not deliver a stale menu after a listener replaces it', async () => {
    const app = await runtime();
    const received: string[] = [];
    app.onSupportLanguagesChange(([first]) => {
      if (first?.value === 'fr-FR')
        void app.setSupportLanguages([menu('en-US')]);
    });
    app.onSupportLanguagesChange(([first]) => {
      if (first) received.push(first.value);
    });
    await app.setSupportLanguages([menu('fr-FR')]);
    expect(received).toEqual(['zh-CN', 'en-US']);
  });

  it('restores even the failing writer and does not confuse notification errors with a failed switch', async () => {
    const app = await runtime();
    const ui = createUiLocale<string>();
    let value = '';
    const writer = defineLocaleAdapter(
      () => value,
      (next) => {
        value = next;
        if (next === 'bad') throw new Error('Cannot apply');
      },
      (next: string) => next,
    );
    const notify = vi.fn();
    await app.setupI18n(createHost(), {
      adapters: { ui: ui.adapter, writer },
      onLocaleChanged: notify,
      languages: {
        'zh-CN': {
          label: 'Chinese',
          resources: { ui: resource('zh'), writer: async () => 'old' },
        },
        'en-US': {
          label: 'English',
          resources: { ui: resource('en'), writer: async () => 'bad' },
        },
        'zh-TW': { label: 'Traditional' },
      },
    });
    await expect(app.loadLocaleMessages('en-US')).rejects.toThrow('en-US');
    expect([ui.locale.value, value, document.documentElement.lang]).toEqual([
      'zh',
      'old',
      'zh-CN',
    ]);
    expect(notify).toHaveBeenCalledTimes(1);
    notify.mockImplementationOnce(() => {
      throw new Error('Storage failed');
    });
    const report = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      expect(await app.changeLocale('zh-TW')).toBe(true);
      expect(document.documentElement.lang).toBe('zh-TW');
      expect(report).toHaveBeenCalled();
    } finally {
      report.mockRestore();
    }
  });
});
