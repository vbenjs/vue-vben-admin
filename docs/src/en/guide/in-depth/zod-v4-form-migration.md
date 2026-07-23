---
outline: deep
---

# Zod 4 and TanStack Form Migration

This migration upgrades form schemas from Zod 3 to Zod 4 and replaces vee-validate with TanStack Form internally. The Vben business API remains stable while implementation-specific form APIs are removed from the public boundary.

## Dependency Changes

| Area | Before | After |
| --- | --- | --- |
| Schema | `zod@^3.25.76` | `zod@^4.4.3` |
| Defaults | `zod-defaults@0.1.3` | `zod-defaults@^0.2.3` |
| Form engine | `vee-validate@^4.15.1` | `@tanstack/vue-form@^1.33.2` |
| Zod adapter | `@vee-validate/zod@^4.15.1` | Removed; TanStack Form supports Standard Schema |

Source files, package manifests, and the lockfile must no longer depend on `vee-validate` or `@vee-validate/zod`.

## Compatibility Boundary

The following Vben APIs remain supported:

- `useVbenForm(options)` returning `[Form, formApi]`
- existing `FormApi` methods for values, reset, validation, submission, schema updates, and component refs
- existing `FormSchema` fields, dependencies, deprecated `valueFormat`, and array schema structure
- application adapters and the re-exported `z` namespace
- the existing `componentField` slot and binding shape

`formApi.form` is now the library-independent `FormContextApi`. It exposes values, errors, meta, set/reset/validate/submit methods, and array operations without leaking vee or raw TanStack generics.

New code uses `reset`, `submit`, `validateAndSubmit`, and `clearValidation`. The former `resetForm`, `submitForm`, `validateAndSubmitForm`, and `resetValidate` names remain deprecated forwarding aliases. They emit one warning per name in development and stay silent in production.

## Form UI API Changes in This Refactor

### Added APIs

| API | Type/Location | Description |
| --- | --- | --- |
| `dependencies.resolve(context)` | `FormItemDependenciesResolve` | Evaluates one complete dynamic patch from declared `triggerFields` and commits it atomically. Context contains readonly `values`, `actions`, `controller`, and row-aware `schema`. |
| `useValues()` | `FormContextApi` | Subscribes to all form values. Use only when full-form reactivity is required. |
| `useFieldValue(fieldName)` | `FormContextApi` | Subscribes to one field value without reacting to unrelated fields. |
| `useFieldValues(fieldNames)` | `FormContextApi` | Subscribes to a declared group of field values. |
| `useFieldError(fieldName)` | `FormContextApi` | Subscribes to one field error without consuming the full error object. |
| `getRawValues()` | `FormApi` | Returns an independent form-value snapshot before codec or legacy formatting. |
| `formatValues(rawValues)` | `FormApi` | Runs the unified formatting pipeline on a supplied raw snapshot. |
| `getValueSnapshot()` | `FormApi` | Returns `{ rawValues, values }`, where `values` is `TSubmitValues`. |
| `asyncDebounceMs` | `FormFieldOptions` | Configures TanStack Field async validation debounce. |
| `changeEventFallback` | `FormCommonConfig` / adapter config | Enables fallback for legacy components that emit `change` without `update:*`; defaults to `false`. |

`dependencies.resolve` may return `if`, `show`, `disabled`, `required`, `rules`, `componentProps`, `help`, and `renderComponentContent`. Omitting `rules` keeps the static rule; returning `rules: null` disables it.

### Changed APIs

| API | Before | After |
| --- | --- | --- |
| Submit callback | `handleSubmit(values)` | `handleSubmit(values, rawValues)`; the first argument is formatted and the second is the matching readonly raw snapshot. Existing single-argument functions remain valid. |
| Values change callback | `handleValuesChange(values, fieldsChanged)` | `handleValuesChange(rawValues, fieldsChanged, getFormattedValues)`; formatting is lazy and incurs no clone/transform cost unless requested. |
| Field validation triggers | Four `validateOn*` booleans | `validateOn?: readonly ('blur' \| 'change')[]`; submit always validates. |
| Change-event compatibility | `disabledOnChangeListener: false` enabled fallback | `changeEventFallback: true` enables fallback with positive semantics. |
| Top-level render callbacks | `componentProps(values, actions, ctx)`, `help(values, actions, ctx)`, `renderComponentContent(values, actions, ctx)` | Receive only lightweight `FormSchemaContext`; value-dependent behavior moves to `dependencies.resolve`. |
| `validateAndSubmit()` | Repeated low-level validation/scroll handling and could validate again during submit | Delegates to canonical `validate()` and shared submission logic; invalid forms do not submit. |
| `getValues()` | Implicitly returned transformed values | Returns codec-encoded `TSubmitValues`; without a codec it preserves legacy formatting. |

### Removed APIs

| Removed API | Replacement |
| --- | --- |
| `FormValidationOptions` | `validate()` and `validateField(fieldName)` no longer accept options. |
| `force` / `silent` / `validated-only` validation modes | Removed because these vee modes have no TanStack runtime semantics. |
| `validateOnBlur` / `validateOnChange` / `validateOnInput` / `validateOnModelUpdate` | Use `formFieldProps.validateOn`; input and model updates are represented by `change`. |
| `disabledOnChangeListener` | Use positive `changeEventFallback`. |
| `disabledOnInputListener` | Input listeners are no longer bound automatically; provide `componentProps.onInput` explicitly when required. |
| `values/actions` parameters from top-level schema render functions | Use `FormSchemaContext`; move value-dependent behavior to `dependencies.resolve`. |

### Deprecated but Supported

- `dependencies.if/show/disabled/required/rules/componentProps/trigger` remain compatible for this release, but every callback is marked `@deprecated` and emits one development warning. If both syntaxes bypass the type union, `resolve` wins.
- `resetForm`, `submitForm`, `resetValidate`, and `validateAndSubmitForm` continue forwarding to canonical methods.
- `FormActions` remains as a deprecated alias of `FormContextApi`.
- `setupVbenForm({ defineRules })` remains supported; `rules` wins for duplicate names.
- The re-exported `z`, `componentField` slots, and `emptyStateValue` remain unchanged.

### Internal Behavior Changes

- Field components use fine-grained value/error selectors; full error aggregation is no longer on the normal input path.
- Async validators discard stale Promises through a Vben generation without reading private TanStack AbortController or meta fields.
- New and legacy dependencies share one atomic executor, so stale async results cannot overwrite newer state.
- New code uses one form-level codec to encode the complete object atomically; legacy array-to-string, range mapping, and schema `valueFormat` remain compatible but deprecated.

## Typed Values and Slots

Application adapters keep the UI component mapping fixed and expose the business value shape as the only generic:

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

`TValues` flows through `VbenFormProps`, `FormSchema`, `FormApi`, `FormContextApi`, value APIs, submit/change callbacks, selectors, and dynamic schema callbacks. The returned `Form` component also exposes typed slots: known field slots use the matching value type for `field.state.value` and `componentField.modelValue`, while all field/default/action slots receive the complete `values` and matching `formApi`. Legacy forms without `TValues` retain arbitrary slot names and broad props.

## New and Legacy Rule Registration

Use `rules` in new code:

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

The legacy `defineRules` option forwards to the same registry:

```ts
setupVbenForm({
  defineRules: {
    required: legacyRequiredRule,
  },
});
```

Legacy runtime usage emits one warning per deprecation key in development and no warnings in production. If both options define the same rule, `rules` wins. The `FormActions` type remains as a deprecated alias of `FormContextApi`; editors report the type deprecation because type-only usage cannot emit runtime warnings.

## Running the Codemod

Run the pinned tool against each affected tsconfig from a clean Git worktree:

```bash
npx --yes zod-v3-to-v4@1.21.3 path/to/tsconfig.json
```

The tool edits `.ts`, `.tsx`, and `.vue` files in place and has no dry-run mode. Always review `git diff` afterward.

The codemod primarily recognizes direct `zod` imports. Schemas that obtain `z` through `@vben/common-ui` or an application adapter need manual review, especially constructor errors, string formats, and dynamic refinement messages.

## Zod 4 Changes

### Unified Error Parameters

Replace `required_error` and `invalid_type_error` with `error`:

```ts
const count = z.number({
  error: (issue) =>
    issue.input === undefined ? 'Count is required' : 'Count must be a number',
});
```

Use an `error(issue)` callback for dynamic refinement messages instead of passing a function that returns params as the second argument to `.refine()`.

### String Formats and Errors

Prefer top-level format schemas:

```ts
z.email('Invalid email');
z.url('Invalid URL');
z.uuid('Invalid UUID');
```

Read validation details from `ZodError.issues`; the old `.errors` property is removed.

### Defaults and Optionality

Zod 4 defaults may return immediately when the input is `undefined`. Review `.default().optional()` using actual parse behavior instead of internal type names.

Vben initial values use this precedence:

1. explicit schema `defaultValue`
2. Zod `.default()`
3. Zod 4-compatible `zod-defaults`
4. component empty-state conventions

Required markers are derived from whether the schema accepts `undefined`.

### Wrappers, Refine, Transform, and Coerce

Do not read `_def`, `_zod.def`, or `typeName`. Use public `.unwrap()` APIs and public pipe inputs. Delegate intersection defaults to the Zod 4-compatible `zod-defaults` package.

Standard Schema validation does not write transform/coerce output back into TanStack Form state. Use the form-level codec for submission payload conversion, or explicitly call `parseAsync` inside the codec `encode` boundary when transformed schema output is required.

Also review these changes:

- `z.record()` should specify key and value schemas
- `z.enum()` replaces former `nativeEnum` use cases
- number integer, Infinity, and finite behavior
- object strictness, merge, and unknown keys
- intersection merge conflicts
- coerce input types defaulting to `unknown`
- removal of Zod 3 types such as `ZodEffects`, `ZodTypeAny`, and `AnyZodObject`

## Form Engine Behavior

`formFieldProps.validateOn` accepts `blur` and `change`, with both enabled by default; submit always validates fields. `asyncDebounceMs` configures TanStack Field async debounce. The four vee-style `validateOn*` booleans and `force/silent/validated-only` modes have been removed.

The shadcn form primitives now use a Vben-owned field context. Labels, controls, descriptions, and messages continue to provide ids, `aria-invalid`, `aria-describedby`, touched, dirty, valid, and error states.

`clearValidation(fieldNames?)` advances Vben's validator generation and clears public error state without relying on a private TanStack AbortController. A Promise that finishes later is discarded as stale. Omitting `fieldNames` covers every registered field and every field with an existing error.

`dependencies.resolve(context)` is the recommended API: it evaluates once and atomically commits one dynamic-state patch, while stale async results are discarded as a unit. Legacy `if/show/disabled/required/rules/componentProps/trigger` callbacks remain supported through the same normalized executor, but are marked `@deprecated` and emit one development warning. Both APIs react only to declared `triggerFields`.

`handleValuesChange(rawValues, fieldsChanged, getFormattedValues)` receives readonly `TFormValues` and runs codec or legacy formatting only when its third argument is called. `getRawValues()` returns form values and `getValues()` returns `TSubmitValues`; use `getValueSnapshot()` when both are required. `handleSubmit(values, rawValues)` receives both forms at submission. Legacy array-to-string, range mapping, and schema `valueFormat` remain compatible but deprecated. Array fields keep using TanStack push/remove operations and stable row identity.

## Test and Acceptance Matrix

Required coverage includes:

- Zod defaults, optional, nullable, intersection, pipe, transform, coerce, and errors
- runtime values, selectors, reset, manual errors, validation, and async validation
- field binding, blur/change triggers, error messages, ARIA, dependencies, and arrays
- new/legacy API equivalence, warning deduplication, production silence, and type aliases
- complete `useVbenForm` lifecycle, submission, `handleValuesChange`, submit-on-change, and async race handling

Acceptance requires zero TypeScript errors, zero build errors, all tests passing, no unhandled browser errors, modified-file formatting and lint passing, and no source dependency on vee or Zod private structures.

## References

- [Zod 4 release notes](https://zod.dev/v4)
- [Zod migration guide](https://zod.dev/v4/changelog)
- [TanStack Form Vue overview](https://tanstack.com/form/latest/docs/framework/vue/overview)
- [TanStack Form validation](https://tanstack.com/form/latest/docs/framework/vue/guides/validation)
