import type {
  BaseFormComponentType,
  FormActions,
  FormCommonConfig,
  FormDependenciesResolveContext,
  FormFieldProps,
  FormFieldSchema,
  FormGroupSchema,
  FormItemDependencies,
  FormItemDependenciesLegacy,
  FormSchema,
  FormSchemaContext,
  FormValues,
  MaybeComponentProps,
} from '../types';

import {
  get,
  isFunction,
  mergeWithArrayOverride,
} from '@vben-core/shared/utils';

import { resolveChildUpdateFieldName } from '../field-name';

type AnyFormFieldSchema = FormFieldSchema<
  BaseFormComponentType,
  Record<string, any>
>;

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
  componentProps: AnyFormFieldSchema['componentProps'],
  baseContext: FormSchemaContext,
) {
  if (!isFunction(componentProps)) {
    return componentProps;
  }

  return () => componentProps(baseContext);
}

function wrapCommonConfig(
  commonConfig: FormCommonConfig | undefined,
  baseContext: FormSchemaContext,
) {
  if (!commonConfig || !isFunction(commonConfig.componentProps)) {
    return commonConfig;
  }

  return {
    ...commonConfig,
    componentProps: wrapComponentProps(
      commonConfig.componentProps,
      baseContext,
    ),
  };
}

function wrapCustomParamsRender(
  render: AnyFormFieldSchema['help'],
  baseContext: FormSchemaContext,
) {
  if (!isFunction(render)) {
    return render;
  }

  return () => render(baseContext);
}

function wrapRenderComponentContent(
  render: AnyFormFieldSchema['renderComponentContent'],
  baseContext: FormSchemaContext,
) {
  if (!isFunction(render)) {
    return render;
  }

  return () => render(baseContext);
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
): FormItemDependencies | undefined {
  if (!dependencies) {
    return dependencies;
  }

  const rowPath = baseContext.rowPath;
  if (!rowPath) {
    return dependencies;
  }

  const triggerFields =
    dependencies.triggerFields?.map((fieldName) =>
      scopeRowFieldName(rowPath, fieldName),
    ) ?? [];
  if (isFunction(dependencies.resolve)) {
    const resolve = dependencies.resolve;
    return {
      resolve(context: FormDependenciesResolveContext) {
        return resolve({
          ...context,
          schema: createSchemaContext(
            baseContext,
            context.values as Partial<Record<string, any>>,
          ),
        });
      },
      triggerFields,
    };
  }

  const legacyDependencies = dependencies as FormItemDependenciesLegacy;

  return {
    ...legacyDependencies,
    componentProps: wrapDependencyFn(
      legacyDependencies.componentProps,
      baseContext,
    ),
    disabled: wrapDependencyFn(legacyDependencies.disabled, baseContext),
    if: wrapDependencyFn(legacyDependencies.if, baseContext),
    required: wrapDependencyFn(legacyDependencies.required, baseContext),
    rules: wrapDependencyFn(legacyDependencies.rules, baseContext),
    show: wrapDependencyFn(legacyDependencies.show, baseContext),
    trigger: wrapDependencyFn(legacyDependencies.trigger, baseContext),
    triggerFields,
  };
}

function createArrayComponentProps(
  schema: AnyFormFieldSchema,
  options: CreateFormFieldSchemaOptions,
) {
  const componentProps = schema.componentProps;
  const arrayProps = 'arrayProps' in schema ? schema.arrayProps : undefined;
  const children = getFormArraySchemaChildren(schema);
  const commonConfig = options.commonConfig;
  const globalCommonConfig = options.globalCommonConfig;
  const schemaProps = children.length > 0 ? { schema: children } : {};

  if (isFunction(componentProps)) {
    return () => ({
      ...arrayProps,
      ...componentProps({ fieldName: schema.fieldName }),
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
  schema: AnyFormFieldSchema,
  options: CreateFormFieldSchemaOptions,
) {
  const restSchema = {
    ...(schema as AnyFormFieldSchema & Record<string, any>),
  };
  Reflect.deleteProperty(restSchema, 'arrayProps');
  Reflect.deleteProperty(restSchema, 'children');
  Reflect.deleteProperty(restSchema, 'type');

  return {
    ...restSchema,
    component: 'VbenFormFieldArray',
    componentProps: createArrayComponentProps(schema, options),
  };
}

interface FormArraySchemaLike {
  children?: unknown;
  componentProps?: unknown;
}

interface UpdatableFormSchemaLike extends FormArraySchemaLike {
  /** 分组没有 fieldName，因此这里是可选的 */
  fieldName?: string;
  type?: string;
}

export function isFormGroupSchema<
  T extends BaseFormComponentType,
  P extends Record<string, any>,
  TValues extends FormValues,
>(schema: FormSchema<T, P, TValues>): schema is FormGroupSchema<T, P, TValues>;
export function isFormGroupSchema<TSchema extends object>(
  schema: TSchema,
): schema is Extract<TSchema, { type: 'group' }>;
export function isFormGroupSchema(schema: object) {
  return 'type' in schema && schema.type === 'group';
}

/**
 * 展开分组，得到表单中全部字段 schema
 */
export function getFormFieldSchemas<
  T extends BaseFormComponentType,
  P extends Record<string, any>,
  TValues extends FormValues,
>(schemas: FormSchema<T, P, TValues>[]): FormFieldSchema<T, P, TValues>[] {
  return schemas.flatMap((schema) =>
    isFormGroupSchema(schema) ? schema.children : [schema],
  );
}

function setSchemaChildren<TSchema extends UpdatableFormSchemaLike>(
  schema: TSchema,
  children: TSchema[],
) {
  if ('children' in schema && Array.isArray(schema.children)) {
    return {
      ...schema,
      children,
    } as TSchema;
  }

  if (
    !isFunction(schema.componentProps) &&
    schema.componentProps &&
    Array.isArray((schema.componentProps as Record<string, any>).schema)
  ) {
    return {
      ...schema,
      componentProps: {
        ...(schema.componentProps as Record<string, any>),
        schema: children,
      },
    } as TSchema;
  }
  return schema;
}

export function getFormArraySchemaChildren<TSchema = FormFieldSchema>(
  schema: FormArraySchemaLike,
): TSchema[] {
  if ('children' in schema && Array.isArray(schema.children)) {
    return schema.children as TSchema[];
  }

  const componentProps = schema.componentProps;
  if (
    !isFunction(componentProps) &&
    componentProps &&
    Array.isArray((componentProps as Record<string, any>).schema)
  ) {
    return (componentProps as Record<string, any>).schema as TSchema[];
  }

  return [];
}

export function isFormArraySchema(schema: Partial<AnyFormFieldSchema>) {
  return (
    ('type' in schema && schema.type === 'array') ||
    schema.component === 'VbenFormFieldArray' ||
    getFormArraySchemaChildren(schema).length > 0
  );
}

export function resolveArrayChildFieldName(rowPath: string, fieldName: string) {
  return scopeRowFieldName(rowPath, fieldName);
}

export function updateFormSchemaList<TSchema extends UpdatableFormSchemaLike>(
  currentSchema: TSchema[],
  updated: Partial<TSchema>[],
): TSchema[] {
  return currentSchema.map((schema) => {
    // 分组本身不是字段，直接把更新下发给组内字段
    if (isFormGroupSchema(schema)) {
      return setSchemaChildren(
        schema,
        updateFormSchemaList((schema.children ?? []) as TSchema[], updated),
      );
    }

    const { fieldName: schemaFieldName } = schema;
    if (!schemaFieldName) {
      return schema;
    }

    const exactUpdatedData = updated.find(
      (item) => item.fieldName === schemaFieldName,
    );
    if (exactUpdatedData) {
      return mergeWithArrayOverride(exactUpdatedData, schema) as TSchema;
    }

    const children = getFormArraySchemaChildren<TSchema>(schema);
    if (children.length === 0) {
      return schema;
    }
    const childUpdates = updated.flatMap((item) => {
      const fieldName = item.fieldName
        ? resolveChildUpdateFieldName(schemaFieldName, item.fieldName)
        : undefined;
      return fieldName ? [{ ...item, fieldName } as Partial<TSchema>] : [];
    });
    if (childUpdates.length === 0) {
      return schema;
    }
    return setSchemaChildren(
      schema,
      updateFormSchemaList(children, childUpdates),
    );
  });
}

/**
 * 按字段名移除 schema，分组内的字段一并处理，分组壳子保留
 */
export function removeFormSchemaByFields<
  TSchema extends UpdatableFormSchemaLike,
>(currentSchema: TSchema[], fields: string[]): TSchema[] {
  const fieldSet = new Set(fields);
  const result: TSchema[] = [];

  for (const schema of currentSchema) {
    if (isFormGroupSchema(schema)) {
      result.push(
        setSchemaChildren(
          schema,
          removeFormSchemaByFields(
            (schema.children ?? []) as TSchema[],
            fields,
          ),
        ),
      );
      continue;
    }

    if (!schema.fieldName || !fieldSet.has(schema.fieldName)) {
      result.push(schema);
    }
  }

  return result;
}

export function createFormFieldSchema(
  schema: AnyFormFieldSchema,
  options: CreateFormFieldSchemaOptions = {},
): NormalizedFormFieldSchema {
  const commonConfig = mergeWithArrayOverride(
    options.commonConfig ?? {},
    options.globalCommonConfig ?? {},
  );
  const {
    changeEventFallback = false,
    colon = false,
    componentProps = {},
    controlClass = '',
    disabled,
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
  const commonComponentProps = isFunction(componentProps)
    ? componentProps({ fieldName: normalizedSchema.fieldName })
    : componentProps;

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
    changeEventFallback,
    colon,
    emptyStateValue,
    hideRequiredMark,
    labelWidth,
    modelPropName,
    wrapperClass,
    ...normalizedSchema,
    commonComponentProps,
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
  schema: AnyFormFieldSchema,
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
      commonConfig: wrapCommonConfig(options.commonConfig, baseContext),
      disabled: options.disabled || schema.disabled,
      forceHideLabel: true,
      globalCommonConfig: wrapCommonConfig(
        options.globalCommonConfig,
        baseContext,
      ),
    },
  );
}
