# 检查更新

## 介绍

当网站有更新时，您可能需要检查更新。框架提供了这一功能，通过定时检查更新，您可以在应用的 preferences.ts 文件中配置 `checkUpdatesInterval`和 `enableCheckUpdates` 字段，以开启和设置检查更新的时间间隔（单位：分钟）。

```ts
import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    // 是否开启检查更新
    enableCheckUpdates: true,
    // 检查更新的时间间隔，单位为分钟
    checkUpdatesInterval: 1,
  },
});
```

## 效果

检测到更新时，会弹出提示框，询问用户是否刷新页面：

![check-updates](/guide/update-notice.png)

## 替换为其他检查更新方式

如果需要通过其他方式检查更新，例如通过接口来更灵活地控制更新逻辑（如强制刷新、显示更新内容等），你可以通过修改 `@vben/layouts` 下面的 `src/widgets/check-updates/check-updates.vue`文件来实现。

```ts
// 这里可以替换为你的检查更新逻辑
async function getVersionTag() {
  try {
    const response = await fetch('/', {
      cache: 'no-cache',
      method: 'HEAD',
    });

    return (
      response.headers.get('etag') || response.headers.get('last-modified')
    );
  } catch {
    console.error('Failed to fetch version tag');
    return null;
  }
}
```
