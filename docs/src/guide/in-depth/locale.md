# 国际化

项目已经集成了 [Vue i18n](https://kazupon.github.io/vue-i18n/)，并且已经配置好了中文和英文的语言包。

## IDE 插件

如果你使用的 vscode 开发工具，则推荐安装 [i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally) 这个插件。它可以帮助你更方便的管理国际化的文案，安装了该插件后，你的代码内可以实时看到对应的语言内容：

![](/public/guide/locale.png)

## 配置默认语言

只需要覆盖默认的偏好设置即可，在对应的应用内，找到 `src/preferences.ts` 文件，修改 `locale` 的值即可：

```ts {3}
export const overridesPreferences = defineOverridesPreferences({
  app: {
    locale: 'en-US',
  },
});
```

缓存中的语言仍然可用时优先使用缓存，否则启动时回退到应用默认语言。单条翻译缺失时默认也使用应用默认语言；可以在 `src/locales/index.ts` 的语言清单中单独设置 `fallbackLocale`。

## 动态切换语言

调用 `changeLocale()` 即可。模板会在加载成功后同步更新偏好和 `Accept-Language`，不要提前调用 `updatePreferences()`。请求被更新的选择取代时返回 `false`，加载失败时抛出错误并保留原语言。原有 `loadLocaleMessages()` 也使用相同的切换流程。

```ts
import { changeLocale } from '@vben/locales';

await changeLocale('en-US');
```

## 新增翻译文本

::: warning 注意

- 请不要将业务翻译文本放到 `@vben/locales` 内，这样可以更好的管理业务和通用的翻译文本。
- 有多个语言包的情况下，新增翻译文本时，需要在所有语言包内新增对应的文本。

:::

新增翻译文本，只需要在对应的应用内，找到 `src/locales/langs/`，新增对应的文本即可，例:

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

## 使用翻译文本

通过 `@vben/locales`，你可以很方便的使用翻译文本：

### 在代码中使用

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

## 新增语言包

以应用新增法语为例，只需两步：

1. 在 `src/locales/index.ts` 的 `languages` 对象中增加 `'fr-FR': { label: 'Français' }`。`AppLocale` 和默认偏好的语言类型会从清单推导，无需手改 `.d.ts`。
2. 添加 `src/locales/langs/fr-FR/common.json`，例如 `{ "cancel": "Annuler", "submit": "Envoyer" }`。文件名就是命名空间：表单和弹窗会直接读取 `common.submit`、`common.cancel`。同理，在 `authentication.json` 中提供 `welcomeBack` 即可翻译共享登录页。应用同名键覆盖共享翻译，无需修改 `packages`。

### 运行时替换菜单

`await setSupportLanguages(list)`（从 `@vben/constants` 导入）**替换**整个菜单。启动前设置的列表优先于静态清单；启动时优先恢复仍然可用的缓存语言。运行中移除当前语言时，先切换到列表中的应用默认语言，否则切到首项。成功后才发布列表，失败时保留原菜单和语言。成功返回 `true`，被后续操作取代返回 `false`；空列表、重复代码和加载失败会抛错。运行时新增的语言也要提供本地或远程译文。

### 从旧配置迁移

把原先在 `loadMessages` 中切换组件库语言的代码移到 `adapters`；加载函数只返回应用译文。直接使用 `useSimpleLocale()` 的组件也应使用完整的共享键，例如将 `cancel` 改为 `common.cancel`、`confirmTitle` 改为 `common.confirm-title`。`setSimpleLocale()` 仅控制未接入应用翻译器的独立组件。

## 界面切换语言功能

如果你想隐藏语言切换按钮，在对应应用的 `src/preferences.ts` 中关闭 `widget.languageToggle`：

```ts {3}
export const overridesPreferences = defineOverridesPreferences({
  widget: {
    languageToggle: false,
  },
});
```

## 远程加载语言包

::: tip 提示

通过项目自带的`request`工具进行接口请求时，默认请求头里会带上 [Accept-Language](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Language) ，服务端可根据请求头进行动态数据国际化处理。

:::

每个应用都有一个独立的语言包，它可以覆盖通用的语言配置，你可以通过远程加载的方式来获取对应的语言包，只需要在对应的应用内，找到 `src/locales/index.ts` 文件，修改 `loadMessages` 方法即可：

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

远程接口应返回可传给 Vue I18n 的语言资源。使用仅运行时构建时，需要返回预编译的消息；`undefined` 表示没有应用翻译，不妨碍共享翻译加载。

## 第三方语言包

各库在 `adapters` 中接入一次。只有希望第三方控件也显示法语时，才在法语条目中提供对应资源。例如在 Antdv Next 模板中：

```ts
const french = {
  label: 'Français',
  resources: {
    dayjs: () => import('dayjs/locale/fr'),
    ui: () => import('antdv-next/dist/locale/fr_FR'),
  },
};
```

每个库分别按目标语言、`fallbackLocale`、应用默认语言选择资源。上例省略了 `vxe`，因此只有表格内置文案使用回退资源，不受上一次切换影响。若法语被设为默认语言且缺少表格资源，请显式设置有完整资源的 `fallbackLocale`。已声明的资源加载失败时，切换失败；不会静默降级。自定义库可以使用 `defineLocaleAdapter(read, write, resolve)`：`resolve` 只转换已加载的数据，`read` 和 `write` 同步读取及恢复库的状态。

## 移除国际化

首先，不是很建议移除国际化，因为国际化是一个很好的开发习惯，但是如果你真的需要移除国际化，你可以直接使用中文文案，然后保留项目自带的语言包即可，整体开发体验不会影响。移除国际化的步骤如下：

- 隐藏界面上的语言切换按钮，见：[界面切换语言功能](#界面切换语言功能)
- 修改默认语言，见：[配置默认语言](#配置默认语言)
- 关闭 `vue-i18n`的警告提示，在`src/locales/index.ts`文件内，修改`missingWarn`为`false`即可：

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
