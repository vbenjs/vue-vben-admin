# Internationalization

The project has integrated [Vue i18n](https://kazupon.github.io/vue-i18n/), and Chinese and English language packs have been configured.

## IDE Plugin

If you are using vscode as your development tool, it is recommended to install the [i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally) plugin. It can help you manage internationalization copy more conveniently. After installing this plugin, you can see the corresponding language content in your code in real-time:

![](/public/guide/locale.png)

## Configure Default Language

You just need to override the default preferences. In the corresponding application, find the `src/preferences.ts` file and modify the value of `locale`:

```ts {3}
export const overridesPreferences = defineOverridesPreferences({
  app: {
    locale: 'en-US',
  },
});
```

A usable saved language takes precedence at startup; otherwise the application default is used. Missing keys also fall back to the application default unless `fallbackLocale` is set separately in `src/locales/index.ts`.

## Dynamic Language Switching

Use `changeLocale()`. The templates update preferences and `Accept-Language` only after the locale has been applied. Do not update preferences first. `changeLocale()` returns `false` if superseded and throws on a loading failure without changing the active language. The existing `loadLocaleMessages()` uses the same pipeline.

```ts
import { changeLocale } from '@vben/locales';

await changeLocale('en-US');
```

## Adding Translation Texts

::: warning Attention

- Do not place business translation texts inside `@vben/locales` to better manage business and general translation texts.
- When adding new translation texts and multiple language packs are available, ensure to add the corresponding texts in all language packs.

:::

To add new translation texts, simply find `src/locales/langs/` in the corresponding application and add the texts accordingly, for example:

**src/locales/langs/zh-CN/\*.json**

```json
{
  "about": {
    "desc": "Vben Admin 是一个现代的管理模版。"
  }
}
```

**src/locales/langs/en-US/\*.json**

```json
{
  "about": {
    "desc": "Vben Admin is a modern management template."
  }
}
```

## Using Translation Texts

With `@vben/locales`, you can easily use translation texts:

### In Code

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@vben/locales';

const items = computed(() => [{ title: $t('demos.title') }]);
</script>
<template>
  <div>{{ $t('demos.title') }}</div>
  <template v-for="item in items">
    <div>{{ item.title }}</div>
  </template>
</template>
```

## Adding a New Language Pack

To add French to one application:

1. Add `'fr-FR': { label: 'Français' }` to `languages` in `src/locales/index.ts`. The template infers `AppLocale` and the allowed preference defaults from the keys. There is no per-language `.d.ts` change.
2. Create `src/locales/langs/fr-FR/common.json`, for example `{ "cancel": "Annuler", "submit": "Envoyer" }`. The filename is the namespace: forms and dialogs read `common.submit` and `common.cancel`. Likewise, `welcomeBack` in `authentication.json` translates the shared login screen. Application keys override shared keys. No `packages` changes are required.

### Replacing the menu at runtime

`await setSupportLanguages(list)` from `@vben/constants` **replaces** the menu. A list set before startup takes precedence over the static menu, including when restoring a cached language. Removing the active locale selects the application default if allowed, or the first entry otherwise. The menu is published only after that switch succeeds. The call returns `true` for success, `false` when superseded, and rejects empty lists, duplicate IDs and load failures. Dynamic languages still require local or remote translations.

### Migrating an existing application

Move library locale setters out of `loadMessages` and into `adapters`; the loader should only return application messages. Components calling `useSimpleLocale()` must use the full shared key: for example, replace `cancel` with `common.cancel` and `confirmTitle` with `common.confirm-title`. `setSimpleLocale()` only controls standalone components without an application translator.

## Interface Language Switching Function

Set `widget.languageToggle` to `false` in the application's `src/preferences.ts` to hide the language switch:

```ts {3}
export const overridesPreferences = defineOverridesPreferences({
  widget: {
    languageToggle: false,
  },
});
```

## Remote Loading of Language Packs

::: tip Tip

When making interface requests through the project's built-in `request` tool, the default request header will include [Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language), allowing the server to dynamically internationalize data based on the request header.

:::

Each application has an independent language pack that can override the general language configuration. You can remotely load the corresponding language pack by finding the `src/locales/index.ts` file in the corresponding application and modifying the `loadMessages` method accordingly:

```ts
async function loadMessages(lang: string) {
  const response = await fetch(
    `/translations/${encodeURIComponent(lang)}.json`,
  );
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`Failed to load translations: ${lang}`);
  return response.json();
}
```

Return resources accepted by Vue I18n, including precompiled messages when using a runtime-only build. Returning `undefined` lets the application use shared messages without an application-specific overlay.

## Third-Party Language Packs

Configure each library once in `adapters`. To translate its built-in controls, provide its resource in the language entry. For example, in the Antdv Next template:

```ts
const french = {
  label: 'Français',
  resources: {
    dayjs: () => import('dayjs/locale/fr'),
    ui: () => import('antdv-next/dist/locale/fr_FR'),
  },
};
```

Each library tries the target, `fallbackLocale`, then the application default independently. Omitting `vxe` above leaves only the table controls in the fallback language, regardless of the previous selection. If French becomes the application default and lacks resources, set `fallbackLocale` to a fully configured language. A declared loader that fails rejects the switch instead of silently falling back. For custom libraries, `defineLocaleAdapter(read, write, resolve)` maps loaded data into library state and uses synchronous reads and writes to support rollback.

## Removing Internationalization

Firstly, it is not recommended to remove internationalization, as it is a good development practice. However, if you really need to remove it, you can directly use Chinese copy and then retain the project's built-in language pack, which will not affect the overall development experience. The steps to remove internationalization are as follows:

- Hide the language switching button on the interface, see: [Interface Language Switching Function](#interface-language-switching-function)
- Modify the default language, see: [Configure Default Language](#configure-default-language)
- Disable `vue-i18n` warning prompts, in the `src/locales/index.ts` file, modify `missingWarn` to `false`:

  ```ts
  async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
    await coreSetup(app, {
      ...localeConfig,
      missingWarn: !import.meta.env.PROD, // [!code --]
      missingWarn: false, // [!code ++]
      ...options,
    });
  }
  ```
