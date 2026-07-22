import type {
  ExtendedFormApi,
  FormDependenciesResolveContext,
  FormDependenciesResolvedState,
  FormItemDependencies,
  FormItemDependenciesLegacy,
  FormItemDependenciesResolve,
  FormSchemaContext,
  FormSchemaRuleType,
  MaybeComponentProps,
} from '../types';

import { computed, isRef, onScopeDispose, shallowRef, watch } from 'vue';

import {
  cloneDeep,
  get,
  isBoolean,
  isEqual,
  isFunction,
} from '@vben-core/shared/utils';

import { warnDeprecatedOnce } from '../deprecation';
import { resolveFieldNamePath } from '../field-name';
import { injectFormProps } from '../use-form-context';
import { injectRenderFormProps } from './context';

interface DependencyState {
  dynamicComponentProps: MaybeComponentProps;
  dynamicHelp: FormDependenciesResolvedState['help'];
  dynamicHelpResolved: boolean;
  dynamicRenderComponentContent: FormDependenciesResolvedState['renderComponentContent'];
  dynamicRenderComponentContentResolved: boolean;
  dynamicRules: FormSchemaRuleType | undefined;
  dynamicRulesResolved: boolean;
  isDisabled: boolean;
  isIf: boolean;
  isRequired: boolean;
  isShow: boolean;
}

const legacyDependencyKeys = [
  'componentProps',
  'disabled',
  'if',
  'required',
  'rules',
  'show',
  'trigger',
] as const;

const mixedDependenciesWarnings = new WeakSet<object>();

/**
 * 解析Nested Objects对应的字段值
 * @param values 表单值
 * @param fieldName 字段名
 */
function resolveValueByFieldName(
  values: Record<string, any>,
  fieldName: string,
) {
  // [] 表示禁用嵌套
  const { rawKey } = resolveFieldNamePath(fieldName);
  if (rawKey) {
    return values[rawKey];
  }

  return get(values, fieldName);
}

function createDependencyState(
  patch: FormDependenciesResolvedState = {},
): DependencyState {
  return {
    dynamicComponentProps: patch.componentProps ?? {},
    dynamicHelp: patch.help,
    dynamicHelpResolved: Reflect.has(patch, 'help'),
    dynamicRenderComponentContent: patch.renderComponentContent,
    dynamicRenderComponentContentResolved: Reflect.has(
      patch,
      'renderComponentContent',
    ),
    dynamicRules: patch.rules,
    dynamicRulesResolved: Reflect.has(patch, 'rules'),
    isDisabled: patch.disabled ?? false,
    isIf: patch.if ?? true,
    isRequired: patch.required ?? false,
    isShow: patch.show ?? true,
  };
}

function isResolveDependencies(
  dependencies: FormItemDependencies,
): dependencies is FormItemDependenciesResolve {
  return isFunction(dependencies.resolve);
}

function warnMixedDependencies(dependencies: FormItemDependenciesResolve) {
  if (
    import.meta.env.PROD ||
    mixedDependenciesWarnings.has(dependencies) ||
    !legacyDependencyKeys.some(
      (key) => Reflect.get(dependencies, key) !== undefined,
    )
  ) {
    return;
  }
  mixedDependenciesWarnings.add(dependencies);
  console.warn(
    '[Vben Form] `dependencies.resolve` cannot be combined with legacy dependency callbacks. `resolve` takes precedence.',
  );
}

async function resolveLegacyDependencies(
  dependencies: FormItemDependenciesLegacy,
  context: FormDependenciesResolveContext,
): Promise<FormDependenciesResolvedState> {
  const patch: FormDependenciesResolvedState = {};
  const { actions, controller, values } = context;
  const {
    componentProps,
    disabled,
    if: whenIf,
    required,
    rules,
    show,
    trigger,
  } = dependencies;

  if (isFunction(whenIf)) {
    patch.if = !!(await whenIf(values, actions, controller));
  } else if (isBoolean(whenIf)) {
    patch.if = whenIf;
  }
  if (patch.if === false) {
    return patch;
  }

  if (isFunction(show)) {
    patch.show = !!(await show(values, actions, controller));
  } else if (isBoolean(show)) {
    patch.show = show;
  }

  if (isFunction(componentProps)) {
    patch.componentProps = await componentProps(values, actions, controller);
  }
  if (isFunction(rules)) {
    patch.rules = await rules(values, actions, controller);
  }
  if (isFunction(disabled)) {
    patch.disabled = !!(await disabled(values, actions, controller));
  } else if (isBoolean(disabled)) {
    patch.disabled = disabled;
  }
  if (isFunction(required)) {
    patch.required = !!(await required(values, actions, controller));
  }
  if (isFunction(trigger)) {
    await trigger(values, actions, controller);
  }

  return patch;
}

export default function useDependencies(
  getDependencies: () => FormItemDependencies | undefined,
  getSchemaContext: () => FormSchemaContext = () => ({}),
) {
  const [extendApi] = injectFormProps();
  const formRenderProps = injectRenderFormProps();

  const formApi = formRenderProps.form;

  if (!formApi) {
    throw new Error('Form api is required in useDependencies');
  }

  const values = formApi.useValues();
  const initialTriggerFields = getDependencies()?.triggerFields ?? [];
  const initialTriggerValues = formApi.useFieldValues(initialTriggerFields);

  // 在 dependencies 里提供访问extendApi的能力
  function getController(): ExtendedFormApi {
    const controller = isRef(extendApi)
      ? extendApi.value.formApi
      : extendApi.formApi;

    if (!controller) {
      throw new Error('formApi is required in useDependencies');
    }

    return controller as unknown as ExtendedFormApi;
  }

  const dependencyState = shallowRef(createDependencyState());
  let previousDependencies: FormItemDependencies | undefined;
  let previousTriggerValues: any[] | undefined;
  let dependencyEvaluationId = 0;

  const triggerFieldValues = computed(() => {
    // 该字段可能会被多个字段触发
    const triggerFields = getDependencies()?.triggerFields ?? [];
    const usesInitialTriggerFields =
      triggerFields.length === initialTriggerFields.length &&
      triggerFields.every(
        (fieldName, index) => fieldName === initialTriggerFields[index],
      );
    if (usesInitialTriggerFields) {
      return initialTriggerValues.value;
    }
    return triggerFields.map((dep) => {
      return resolveValueByFieldName(values.value, dep);
    });
  });

  function resetConditionState() {
    dependencyState.value = createDependencyState();
  }

  watch(
    [triggerFieldValues, getDependencies],
    async ([currentTriggerValues, dependencies]) => {
      if (!dependencies || !dependencies?.triggerFields?.length) {
        dependencyEvaluationId += 1;
        previousDependencies = dependencies;
        previousTriggerValues = undefined;
        resetConditionState();
        return;
      }
      if (
        dependencies === previousDependencies &&
        previousTriggerValues &&
        isEqual(currentTriggerValues, previousTriggerValues)
      ) {
        return;
      }
      previousDependencies = dependencies;
      previousTriggerValues = cloneDeep(currentTriggerValues);
      const currentEvaluationId = ++dependencyEvaluationId;
      const context: FormDependenciesResolveContext = {
        actions: formApi,
        controller: getController(),
        schema: {
          ...getSchemaContext(),
          rootValues: values.value,
        },
        values: values.value,
      };
      let patch: FormDependenciesResolvedState | undefined;
      if (isResolveDependencies(dependencies)) {
        warnMixedDependencies(dependencies);
        patch = await dependencies.resolve(context);
      } else {
        warnDeprecatedOnce(
          'form-dependencies-legacy-callbacks',
          '[Vben Form] Legacy dependency callbacks are deprecated. Use `dependencies.resolve(context)` instead.',
        );
        patch = await resolveLegacyDependencies(dependencies, context);
      }
      if (currentEvaluationId !== dependencyEvaluationId) {
        return;
      }
      dependencyState.value = createDependencyState(patch);
    },
    { immediate: true },
  );

  onScopeDispose(() => {
    dependencyEvaluationId += 1;
  });

  return {
    dynamicComponentProps: computed(
      () => dependencyState.value.dynamicComponentProps,
    ),
    dynamicHelp: computed(() => dependencyState.value.dynamicHelp),
    dynamicHelpResolved: computed(
      () => dependencyState.value.dynamicHelpResolved,
    ),
    dynamicRenderComponentContent: computed(
      () => dependencyState.value.dynamicRenderComponentContent,
    ),
    dynamicRenderComponentContentResolved: computed(
      () => dependencyState.value.dynamicRenderComponentContentResolved,
    ),
    dynamicRules: computed(() => dependencyState.value.dynamicRules),
    dynamicRulesResolved: computed(
      () => dependencyState.value.dynamicRulesResolved,
    ),
    isDisabled: computed(() => dependencyState.value.isDisabled),
    isIf: computed(() => dependencyState.value.isIf),
    isRequired: computed(() => dependencyState.value.isRequired),
    isShow: computed(() => dependencyState.value.isShow),
  };
}
