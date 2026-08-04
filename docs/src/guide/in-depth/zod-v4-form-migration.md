---
outline: deep
---

# Zod 4 与 TanStack Form 迁移指南

本次迁移将表单校验 schema 从 Zod 3 升级到 Zod 4，并将内部表单引擎从 vee-validate 替换为 TanStack Form。迁移目标是保持 Vben 业务 API 稳定，同时移除业务代码对具体表单引擎的耦合。

## 依赖变化

| 类型 | 迁移前 | 迁移后 |
| --- | --- | --- |
| Schema | `zod@^3.25.76` | `zod@^4.4.3` |
| 默认值 | `zod-defaults@0.1.3` | `zod-defaults@^0.2.3` |
| 表单引擎 | `vee-validate@^4.15.1` | `@tanstack/vue-form@^1.33.2` |
| Zod 适配器 | `@vee-validate/zod@^4.15.1` | 不再需要，TanStack Form 支持 Standard Schema |

迁移后，源码、package manifest 和锁文件中都不应再依赖 `vee-validate` 或 `@vee-validate/zod`。

## 上层兼容范围

以下 Vben API 保持兼容：

- `useVbenForm(options)` 仍返回 `[Form, formApi]`
- `FormApi` 的值、校验、提交、重置、schema 更新和组件引用能力
- `FormSchema` 的 `fieldName`、`component`、`componentProps`、`rules`、`dependencies`、`defaultValue`、已弃用的 `valueFormat` 和数组字段结构
- `dependencies.triggerFields` 与回调参数
- 组件适配器和 `z` 重导出路径
- 自定义 slot 中原有的 `componentField` 绑定对象

`formApi.form` 现在是库无关的 `FormContextApi`。它提供 values、errors、meta、字段读写、验证、提交、重置和数组操作，但不再暴露 vee `FormContext` 或原始 TanStack 实例。

新代码使用 `reset`、`submit`、`validateAndSubmit` 和 `clearValidation`。旧的 `resetForm`、`submitForm`、`validateAndSubmitForm` 和 `resetValidate` 仍会委托给新实现，并通过 `@deprecated` 与开发环境一次性 warning 提示迁移；生产环境不输出 warning。

## 本轮 Form UI API 变更

### 新增 API

| API | 类型/位置 | 说明 |
| --- | --- | --- |
| `dependencies.resolve(context)` | `FormItemDependenciesResolve` | 根据声明的 `triggerFields` 一次计算完整动态 patch，并原子更新字段状态。context 包含只读 `values`、`actions`、`controller` 和数组行感知的 `schema`。 |
| `useValues()` | `FormContextApi` | 订阅完整表单值。仅在确实需要整表响应式值时使用。 |
| `useFieldValue(fieldName)` | `FormContextApi` | 订阅单字段值，避免无关字段变化触发组件更新。 |
| `useFieldValues(fieldNames)` | `FormContextApi` | 订阅一组字段值，主要用于声明式依赖计算。 |
| `useFieldError(fieldName)` | `FormContextApi` | 订阅单字段错误，不再依赖全量错误对象。 |
| `getRawValues()` | `FormApi` | 返回未执行 codec 或旧格式化管道的独立表单值快照。 |
| `formatValues(rawValues)` | `FormApi` | 对指定原始值执行统一格式化流水线。 |
| `getValueSnapshot()` | `FormApi` | 同时返回 `{ rawValues, values }`，其中 `values` 为 `TSubmitValues`。 |
| `asyncDebounceMs` | `FormFieldOptions` | 设置 TanStack Field 异步校验防抖时间。 |
| `changeEventFallback` | `FormCommonConfig` / adapter config | 为只发送 `change`、不发送 `update:*` 的旧组件启用事件回退，默认 `false`。 |

`dependencies.resolve` 可以返回 `if`、`show`、`disabled`、`required`、`rules`、`componentProps`、`help` 和 `renderComponentContent`。未返回 `rules` 时继续使用静态规则；显式返回 `rules: null` 时关闭静态规则。

### 变更的 API

| API | 迁移前 | 迁移后 |
| --- | --- | --- |
| 提交回调 | `handleSubmit(values)` | `handleSubmit(values, rawValues)`；首参为格式化值，次参为同一次提交对应的只读原始快照。旧单参数函数仍可直接使用。 |
| 值变化回调 | `handleValuesChange(values, fieldsChanged)` | `handleValuesChange(rawValues, fieldsChanged, getFormattedValues)`；第三个参数为惰性格式化函数，不调用时不产生深拷贝和转换开销。 |
| 字段校验触发 | 四个 `validateOn*` 布尔项 | `validateOn?: readonly ('blur' \| 'change')[]`；submit 始终校验。 |
| change 事件兼容 | `disabledOnChangeListener: false` 表示启用 | `changeEventFallback: true` 表示启用，改为正向语义。 |
| 顶层动态渲染回调 | `componentProps(values, actions, ctx)`、`help(values, actions, ctx)`、`renderComponentContent(values, actions, ctx)` | 仅接收轻量 `FormSchemaContext`。依赖表单值的动态逻辑迁移到 `dependencies.resolve`。 |
| `validateAndSubmit()` | 自行调用底层校验并重复实现错误滚动，提交阶段可能再次校验 | 委托统一 `validate()` 与共享提交逻辑，无效时不提交，错误滚动只有一个实现。 |
| `getValues()` | 隐式完成所有字段转换 | 返回 codec 编码后的 `TSubmitValues`；无 codec 时保持旧格式化行为。 |

### 删除的 API

| 已删除 API | 替代方式 |
| --- | --- |
| `FormValidationOptions` | `validate()` 与 `validateField(fieldName)` 不再接收 options。 |
| `force` / `silent` / `validated-only` validation mode | 这些 vee mode 在 TanStack runtime 中没有对应语义，直接删除。 |
| `validateOnBlur` / `validateOnChange` / `validateOnInput` / `validateOnModelUpdate` | 使用 `formFieldProps.validateOn`；input 与 model update 统一归入 `change`。 |
| `disabledOnChangeListener` | 使用正向语义的 `changeEventFallback`。 |
| `disabledOnInputListener` | 不再自动绑定 input listener；确需自定义 input 处理时在 `componentProps.onInput` 中显式提供。 |
| 顶层 schema 渲染函数中的 `values/actions` 参数 | 使用 `FormSchemaContext`；值相关联动使用 `dependencies.resolve`。 |

### 已弃用但保留兼容

- `dependencies.if/show/disabled/required/rules/componentProps/trigger` 本轮仍完整兼容，但均已标记 `@deprecated`。开发环境首次使用时警告一次；新旧语法绕过类型同时存在时以 `resolve` 为准。
- `resetForm`、`submitForm`、`resetValidate` 和 `validateAndSubmitForm` 继续转发到新方法。
- `FormActions` 继续作为 `FormContextApi` 的弃用类型别名。
- `setupVbenForm({ defineRules })` 继续兼容；与 `rules` 同名时新 API 优先。
- `z` 重导出、`componentField` slot 和 `emptyStateValue` 保持不变。

### 非 API 行为调整

- 字段组件改用细粒度 value/error selector；全量错误聚合退出普通输入热路径。
- async validator 通过 Vben generation 丢弃过期 Promise，不读取 TanStack 私有 AbortController 或 meta 字段。
- dependencies 新旧语法共用一个原子执行器，异步旧结果不会覆盖新状态。
- 新代码使用表单级 codec 原子编码完整对象；旧 array-to-string、时间范围映射和 schema `valueFormat` 继续兼容但已弃用。

## 值类型与插槽类型

应用 adapter 保留 UI 组件类型，只把业务值类型作为泛型暴露：

```ts
interface AccountFormValues {
  email: string;
  nickname: string;
}

const [Form, formApi] = useVbenForm<AccountFormValues>({
  handleSubmit(values) {
    return addAccount(values);
  },
  schema: [
    { component: 'Input', fieldName: 'email' },
    { component: 'Input', fieldName: 'nickname' },
  ],
});
```

`TValues` 会传递给 `VbenFormProps`、`FormSchema`、`FormApi`、`FormContextApi`、值读写 API、提交/变化回调、selector 和 schema 动态回调。返回的 `Form` 组件同时提供 typed slots：已知字段插槽的 `field.state.value` 与 `componentField.modelValue` 使用对应字段类型，并额外提供完整 `values` 与同型 `formApi`；默认和操作插槽也提供 `values/formApi`。未声明 `TValues` 的旧表单仍允许任意字段插槽并回退为宽泛类型。

## 新旧规则注册 API

新代码使用 `rules`：

```ts
setupVbenForm({
  rules: {
    required(value, _params, context) {
      const isEmpty =
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0);
      return isEmpty ? `${context.label} is required` : true;
    },
  },
});
```

旧的 `defineRules` 仍会转发到同一个规则注册表：

```ts
setupVbenForm({
  defineRules: {
    required: legacyRequiredRule,
  },
});
```

使用旧入口时，开发环境针对该弃用项只输出一次警告；生产环境不输出。若同时提供 `rules` 与 `defineRules` 的同名规则，`rules` 优先。`FormActions` 类型保留为 `FormContextApi` 的弃用别名，类型别名本身无法触发运行时警告，编辑器会通过 `@deprecated` 提示迁移。

## 使用迁移工具

建议在干净的 Git 工作树中按项目 tsconfig 执行固定版本工具：

```bash
npx --yes zod-v3-to-v4@1.21.3 path/to/tsconfig.json
```

工具会原地修改 `.ts`、`.tsx` 和 `.vue` 文件，没有 dry-run 模式。执行后必须检查 `git diff`。

工具只能可靠识别直接从 `zod` 导入的调用。通过 `@vben/common-ui` 或应用 adapter 间接取得 `z` 的 schema 需要人工审计，尤其是构造器错误参数、字符串格式和动态 refine 参数。

## Zod 4 代码变更

### 错误参数

构造器中的 `required_error` 和 `invalid_type_error` 合并为 `error`：

```ts
const count = z.number({
  error: (issue) =>
    issue.input === undefined ? 'Count is required' : 'Count must be a number',
});
```

refinement 继续支持字符串或对象参数。需要根据输入动态生成消息时，使用 `error(issue)`，不再传入返回 params 的第二个函数。

### 字符串格式

优先使用顶层格式 API：

```ts
z.email('Invalid email');
z.url('Invalid URL');
z.uuid('Invalid UUID');
```

旧的 `z.string().email()` 等形式不应继续新增。

### 错误列表

ZodError 使用 `issues`：

```ts
const result = schema.safeParse(value);
if (!result.success) {
  console.log(result.error.issues);
}
```

不要读取已移除的 `.errors`。

### 默认值与 optional

Zod 4 的 default 在输入为 `undefined` 时可以直接返回默认值。`.default().optional()` 的结果必须按实际 parse 语义复核，而不是通过类型名称猜测。

Vben 表单按以下优先级生成初值：

1. schema 中显式 `defaultValue`
2. Zod schema 中的 `.default()`
3. `zod-defaults` 生成的对象、intersection 和基础空值
4. Vben 组件约定的空字符串、空数组或空状态值

必填标记以 schema 是否接受 `undefined` 为准。

### 包装器、refine 与 transform

不要读取 `_def`、`_zod.def` 或 `typeName`。公共包装器使用 `.unwrap()`；Zod 4 的 transform/pipe 使用公开的输入 schema。intersection 的默认值交给支持 Zod 4 的 `zod-defaults` 处理。

TanStack Form 使用 Standard Schema 校验时不会自动把 transform/coerce 的输出写回当前表单 state。提交 payload 需要转换时，使用表单级 codec；如果必须提交 schema transform 后的结果，应在 codec 的 `encode` 边界显式调用 `parseAsync`。

### 其他需要复核的 API

- `z.record()` 需要明确 key schema 与 value schema
- `z.enum()` 已覆盖原 `nativeEnum` 用法
- number 的 `int`、Infinity 和 finite 约束需按 Zod 4 语义复核
- object 的 strict、merge、unknown keys 行为需要通过测试确认
- intersection 合并冲突现在可能直接抛出错误
- coerce schema 的 input 类型默认为 `unknown`
- `ZodEffects`、`ZodTypeAny`、`AnyZodObject` 等 Zod 3 类型不应继续使用

## 表单引擎行为

### 验证触发

`formFieldProps.validateOn` 接收 `blur`、`change` 数组，默认两者都启用；所有字段仍会在 submit 时验证。`asyncDebounceMs` 映射到 TanStack Field 的异步防抖配置。原 vee 风格的四个 `validateOn*` 布尔项和 `force/silent/validated-only` mode 已删除。

### 错误与可访问性

shadcn form primitive 使用 Vben 自有字段上下文，不再注入 vee 的 `FieldContextKey`。`FormLabel`、`FormControl`、`FormDescription` 和 `FormMessage` 继续维护：

- `for` 与 control id
- `aria-invalid`
- `aria-describedby`
- touched、dirty、valid 和错误消息

`clearValidation(fieldNames?)` 会递增 Vben validator generation 并清空公开错误状态，不依赖 TanStack 私有 AbortController。异步 Promise 即使随后完成也会因代次过期而被丢弃；省略字段参数时会处理全部已注册或已有错误的字段。

### 依赖与数组

`dependencies.resolve(context)` 是推荐语法：一次求值并原子提交完整动态 patch，过期异步结果整体丢弃。旧的 `if/show/disabled/required/rules/componentProps/trigger` 语法仍兼容，但已标记为 `@deprecated` 并在开发环境首次使用时提示迁移；内部仍归一到同一个执行器。两种语法都只根据 `triggerFields` 重算，无关字段变化不会执行回调。

`handleValuesChange(rawValues, fieldsChanged, getFormattedValues)` 接收只读 `TFormValues`，第三个参数仅在调用时执行 codec 或旧格式化管道。`getRawValues()` 返回表单值，`getValues()` 返回 `TSubmitValues`；需要同时比较时使用 `getValueSnapshot()`。提交回调通过 `handleSubmit(values, rawValues)` 同时取得两种结构。旧 array-to-string、时间范围映射和 schema `valueFormat` 继续兼容但已弃用。数组字段继续使用 TanStack push/remove 操作和稳定行身份。

## 测试与验收

迁移至少需要覆盖以下层级：

- Zod 4 helper：default、optional、nullable、intersection、pipe、transform、coerce 与错误参数
- runtime：值读写、selector、reset、字段错误、validate 和异步校验
- 组件：输入绑定、blur/change 触发、错误消息、ARIA、dependencies 和数组增删
- 兼容：`rules`/`defineRules` 结果一致、开发 warning 去重、生产静默、类型别名
- 集成：`useVbenForm` 生命周期、提交、`handleValuesChange`、submit-on-change 和 async race

验收标准：

1. 受影响 package、应用、playground 和 docs 无 TypeScript 错误
2. form-ui 与所有应用构建成功
3. 单元、组件和集成测试全部通过
4. 浏览器 smoke 流程无 `pageerror`、`console.error` 或未处理 Promise
5. 修改文件通过 oxfmt 与 ESLint
6. 静态搜索中不再出现 vee 依赖、Zod 私有结构或 Zod 3 错误参数

## 参考资料

- [Zod 4 release notes](https://zod.dev/v4)
- [Zod migration guide](https://zod.dev/v4/changelog)
- [TanStack Form Vue overview](https://tanstack.com/form/latest/docs/framework/vue/overview)
- [TanStack Form validation](https://tanstack.com/form/latest/docs/framework/vue/guides/validation)
