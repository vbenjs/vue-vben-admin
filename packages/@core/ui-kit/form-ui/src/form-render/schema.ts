import type {
  BaseFormComponentType,
  FormActions,
  FormCommonConfig,
  FormFieldProps,
  FormItemDependencies,
  FormSchema,
  FormSchemaContext,
  MaybeComponentProps,
} from '../types';

import {
  get,
  isFunction,
  mergeWithArrayOverride,
} from '@vben-core/shared/utils';

type AnyFormSchema = FormSchema<BaseFormComponentType, Record<string, any>>;

export type NormalizedFormFieldSchema = FormFieldProps & {
  commonComponentProps: MaybeComponentProps;
  formFieldProps: Record<string, any>;
  formItemClass: string;
};

interface CreateFormFieldSchemaOptions {
  commonConfig?: FormCommonConfig;
  disabled?: boolean;
  forceHideLabel?: boolean;
  globalCommonConfig?: FormCommonConfig;
  hidden?: boolean;
}

interface CreateArrayChildSchemaOptions extends CreateFormFieldSchemaOptions {
  arrayField: string;
  index: number;
}

function createSchemaContext(
  baseContext: FormSchemaContext,
  values?: Partial<Record<string, any>>,
): FormSchemaContext {
  const rootValues = values as Record<string, any> | undefined;
  return {
    ...baseContext,
    rootValues,
    row:
      baseContext.rowPath && rootValues
        ? get(rootValues, baseContext.rowPath)
        : undefined,
  };
}

function scopeRowFieldName(rowPath: string, fieldName: string) {
  if (!fieldName) {
    return fieldName;
  }

  if (fieldName.startsWith('$root.')) {
    return fieldName.slice('$root.'.length);
  }

  if (fieldName.startsWith('$row.')) {
    return `${rowPath}.${fieldName.slice('$row.'.length)}`;
  }

  if (fieldName === rowPath || fieldName.startsWith(`${rowPath}.`)) {
    return fieldName;
  }

  return `${rowPath}.${fieldName}`;
}

function wrapComponentProps(
  componentProps: AnyFormSchema['componentProps'],
  baseContext: FormSchemaContext,
) {
  if (!isFunction(componentProps)) {
    return componentProps;
  }

  return (values: Partial<Record<string, any>>, actions: FormActions) =>
    componentProps(values, actions, createSchemaContext(baseContext, values));
}

function wrapCustomParamsRender(
  render: AnyFormSchema['help'],
  baseContext: FormSchemaContext,
) {
  if (!isFunction(render)) {
    return render;
  }

  return (values: Partial<Record<string, any>>, actions: FormActions) =>
    render(values, actions, createSchemaContext(baseContext, values));
}

function wrapRenderComponentContent(
  render: AnyFormSchema['renderComponentContent'],
  baseContext: FormSchemaContext,
) {
  if (!isFunction(render)) {
    return render;
  }

  return (values: Partial<Record<string, any>>, actions: FormActions) =>
    render(values, actions, createSchemaContext(baseContext, values));
}

function wrapDependencyFn<T>(handler: T, baseContext: FormSchemaContext): T {
  if (!isFunction(handler)) {
    return handler;
  }

  return ((
    values: Partial<Record<string, any>>,
    actions: FormActions,
    controller: any,
  ) =>
    handler(
      values,
      actions,
      controller,
      createSchemaContext(baseContext, values),
    )) as T;
}

function scopeDependencies(
  dependencies: FormItemDependencies | undefined,
  baseContext: FormSchemaContext,
) {
  if (!dependencies) {
    return dependencies;
  }

  const rowPath = baseContext.rowPath;
  if (!rowPath) {
    return dependencies;
  }

  return {
    ...dependencies,
    componentProps: wrapDependencyFn(dependencies.componentProps, baseContext),
    disabled: wrapDependencyFn(dependencies.disabled, baseContext),
    if: wrapDependencyFn(dependencies.if, baseContext),
    required: wrapDependencyFn(dependencies.required, baseContext),
    rules: wrapDependencyFn(dependencies.rules, baseContext),
    show: wrapDependencyFn(dependencies.show, baseContext),
    trigger: wrapDependencyFn(dependencies.trigger, baseContext),
    triggerFields:
      dependencies.triggerFields?.map((fieldName) =>
        scopeRowFieldName(rowPath, fieldName),
      ) ?? [],
  };
}

function createArrayComponentProps(
  schema: AnyFormSchema,
  options: CreateFormFieldSchemaOptions,
) {
  const componentProps = schema.componentProps;
  const arrayProps = 'arrayProps' in schema ? schema.arrayProps : undefined;
  const children = getFormArraySchemaChildren(schema);
  const commonConfig = options.commonConfig;
  const globalCommonConfig = options.globalCommonConfig;
  const schemaProps = children.length > 0 ? { schema: children } : {};

  if (isFunction(componentProps)) {
    return (values: Partial<Record<string, any>>, actions: FormActions) => ({
      ...arrayProps,
      ...componentProps(values, actions),
      commonConfig,
      globalCommonConfig,
      ...schemaProps,
    });
  }

  return {
    ...arrayProps,
    ...componentProps,
    commonConfig,
    globalCommonConfig,
    ...schemaProps,
  };
}

function createArrayFieldSchema(
  schema: AnyFormSchema,
  options: CreateFormFieldSchemaOptions,
) {
  const restSchema = { ...(schema as AnyFormSchema & Record<string, any>) };
  Reflect.deleteProperty(restSchema, 'arrayProps');
  Reflect.deleteProperty(restSchema, 'children');
  Reflect.deleteProperty(restSchema, 'type');

  return {
    ...restSchema,
    component: 'VbenFormFieldArray',
    componentProps: createArrayComponentProps(schema, options),
  };
}

export function getFormArraySchemaChildren(schema: Partial<AnyFormSchema>) {
  if ('children' in schema && Array.isArray(schema.children)) {
    return schema.children;
  }

  const componentProps = schema.componentProps;
  if (
    !isFunction(componentProps) &&
    componentProps &&
    Array.isArray((componentProps as Record<string, any>).schema)
  ) {
    return (componentProps as Record<string, any>).schema;
  }

  return [];
}

export function isFormArraySchema(schema: Partial<AnyFormSchema>) {
  return (
    ('type' in schema && schema.type === 'array') ||
    schema.component === 'VbenFormFieldArray' ||
    getFormArraySchemaChildren(schema).length > 0
  );
}

export function resolveArrayChildFieldName(rowPath: string, fieldName: string) {
  return scopeRowFieldName(rowPath, fieldName);
}

export function createFormFieldSchema(
  schema: AnyFormSchema,
  options: CreateFormFieldSchemaOptions = {},
): NormalizedFormFieldSchema {
  const commonConfig = mergeWithArrayOverride(
    options.commonConfig ?? {},
    options.globalCommonConfig ?? {},
  );
  const {
    colon = false,
    componentProps = {},
    controlClass = '',
    disabled,
    disabledOnChangeListener = true,
    disabledOnInputListener = true,
    emptyStateValue = undefined,
    formFieldProps = {},
    formItemClass = '',
    hideLabel = false,
    hideRequiredMark = false,
    labelClass = '',
    labelWidth = 100,
    modelPropName = '',
    wrapperClass = '',
  } = commonConfig;

  const normalizedSchema = isFormArraySchema(schema)
    ? createArrayFieldSchema(schema, options)
    : schema;

  let resolvedSchemaFormItemClass = normalizedSchema.formItemClass;
  if (isFunction(normalizedSchema.formItemClass)) {
    try {
      resolvedSchemaFormItemClass = normalizedSchema.formItemClass();
    } catch (error) {
      console.error('Error calling formItemClass function:', error);
      resolvedSchemaFormItemClass = '';
    }
  }

  return {
    colon,
    disabledOnChangeListener,
    disabledOnInputListener,
    emptyStateValue,
    hideRequiredMark,
    labelWidth,
    modelPropName,
    wrapperClass,
    ...normalizedSchema,
    commonComponentProps: componentProps as MaybeComponentProps,
    componentProps: normalizedSchema.componentProps,
    controlClass: [controlClass, normalizedSchema.controlClass]
      .filter(Boolean)
      .join(' '),
    formFieldProps: {
      ...formFieldProps,
      ...normalizedSchema.formFieldProps,
    },
    formItemClass: [
      'shrink-0',
      options.hidden ? 'hidden' : '',
      formItemClass,
      resolvedSchemaFormItemClass,
    ]
      .filter(Boolean)
      .join(' '),
    labelClass: [labelClass, normalizedSchema.labelClass]
      .filter(Boolean)
      .join(' '),
    disabled: options.disabled ?? normalizedSchema.disabled ?? disabled,
    hideLabel:
      options.forceHideLabel ?? normalizedSchema.hideLabel ?? hideLabel,
  } as NormalizedFormFieldSchema;
}

export function createArrayChildSchema(
  schema: AnyFormSchema,
  options: CreateArrayChildSchemaOptions,
): NormalizedFormFieldSchema {
  const rowPath = `${options.arrayField}[${options.index}]`;
  const fieldName = resolveArrayChildFieldName(rowPath, schema.fieldName);
  const baseContext: FormSchemaContext = {
    arrayField: options.arrayField,
    fieldName,
    originalFieldName: schema.fieldName,
    rowIndex: options.index,
    rowPath,
  };

  return createFormFieldSchema(
    {
      ...schema,
      componentProps: wrapComponentProps(schema.componentProps, baseContext),
      dependencies: scopeDependencies(schema.dependencies, baseContext),
      fieldName,
      help: wrapCustomParamsRender(schema.help, baseContext),
      renderComponentContent: wrapRenderComponentContent(
        schema.renderComponentContent,
        baseContext,
      ),
    },
    {
      commonConfig: options.commonConfig,
      disabled: options.disabled || schema.disabled,
      forceHideLabel: true,
      globalCommonConfig: options.globalCommonConfig,
    },
  );
}
