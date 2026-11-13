# Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) 是一个实用性优先的 CSS 框架，用于快速构建自定义设计。当前项目使用的是 **Tailwind CSS v4**。

## 配置

项目当前不再通过 `tailwind.config.*` 文件维护 Tailwind 配置，主题与扫描范围都统一放在 CSS 与共享 Vite 配置中。

- 主题入口：`internal/tailwind-config/src/theme.css`
- Vite 集成：`internal/vite-config`

在 `global.css` 中你会看到当前项目使用的 Tailwind CSS v4 指令，例如：

- `@source`
- `@custom-variant`
- `@theme`
- `@theme inline`
- `@utility`

## 包使用 Tailwind CSS 的方式

当前项目不会根据某个包下是否存在 `tailwind.config.mjs` 来决定是否启用 Tailwind CSS。

应用和包统一复用 `@vben/vite-config`，并由该配置接入 `@tailwindcss/vite`。Tailwind 的扫描范围则统一在 `@vben/tailwind-config` 对应的 `internal/tailwind-config/src/theme.css` 中维护。

::: tip 包使用 Tailwind CSS 的说明

如果你是纯粹的 SDK 包，不需要使用 Tailwind CSS，则无需额外增加旧版 `tailwind.config.*` 文件。

:::

## 自定义工具类与 `cn()`

项目中的自定义工具类(如 `flex-center`)统一在 `internal/tailwind-config/src/theme.css` 中以 `@utility` 语法定义。

**新增自定义工具类时，需要同步在 `packages/@core/base/shared/src/utils/cn.ts` 的 `customUtilityClassGroups` 中登记，且每个类只能登记一次。** 复合工具类会设置多条 CSS 属性，需要独立分组。例如：

```ts
const customUtilityClassGroups = {
  'flex-center': ['flex-center'],
  'flex-col-center': ['flex-col-center'],
};
```

同时在 `extendTailwindMerge` 的 `conflictingClassGroups` 中配置单向冲突：`flex-center` 可以移除前面的 `display`、`align-items`、`justify-content` 类；`flex-col-center` 还可以移除前面的 `flex-direction` 类和 `flex-center`。新增分组的 ID 通过 `keyof typeof customUtilityClassGroups` 传给 `extendTailwindMerge` 的泛型参数。

只有当前工具类完整覆盖前一个类的全部属性时，才配置删除前一个类的冲突关系：

```ts
cn('items-start', 'flex-center'); // 'flex-center'
cn('flex-center', 'items-start'); // 'flex-center items-start'
cn('flex-center', 'flex'); // 'flex-center flex'
cn('flex-col-center', 'flex-center'); // 'flex-col-center flex-center'
cn('flex-col-center', 'hidden md:flex'); // 'flex-col-center hidden md:flex'
```

后置原子类只覆盖它负责的属性，复合类继续提供剩余属性。这里的居中复合类在生成的 CSS 中排在对应原子类之前，因此 `hidden` 可以隐藏元素，而 `md:flex` 恢复显示后仍保留列方向和居中布局。不同变体或 `!important` 标记按 tailwind-merge 的作用范围分别处理。

::: warning 保留复合类中的独立属性

不要把复合类直接加入 `display` 等原子分组，也不要将同一个类登记到多个组。tailwind-merge 按整个类删除，局部属性冲突不应导致对齐、方向等独立属性一并丢失。

守卫测试 `packages/@core/base/shared/src/utils/__tests__/cn.test.ts` 会检查登记完整性、有效性和唯一性。

:::

## Vue SFC 中的 `@apply`

项目对 Vue 单文件组件中的 `@apply` 做了统一处理，相关逻辑位于：

- `internal/vite-config/src/plugins/tailwind-reference.ts`

当组件样式中使用 `@apply` 时，会自动注入 `@reference "@vben/tailwind-config/theme"`，一般不需要手动补充。
