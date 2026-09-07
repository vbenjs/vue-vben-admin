import type {
  BaseFormComponentType,
  ExtendedFormApi,
  FormActions,
  FormContextApi,
  FormFieldOptions,
  FormFieldSchema,
  FormGroupSchema,
  FormItemDependencies,
  FormSchema,
  FormValidationResult,
  FormValuePatch,
  FormValueSnapshot,
  VbenFormAdapterOptions,
  VbenFormProps,
} from '../src/types';

import { describe, expectTypeOf, it } from 'vitest';

import { useVbenForm } from '../src/use-vben-form';

interface AccountFormValues {
  email: string;
  profile: {
    nickname: string;
  };
  roles: string[];
}

interface AccountSubmitValues {
  email: string;
  nickname: string;
  roles: string;
}

describe('form public types', () => {
  it('keeps the compatibility alias and stable method signatures', () => {
    expectTypeOf<FormActions>().toEqualTypeOf<FormContextApi>();
    expectTypeOf<FormActions['setFieldValue']>()
      .parameter(0)
      .toMatchTypeOf<string>();
    expectTypeOf<
      FormActions['validate']
    >().returns.resolves.toEqualTypeOf<FormValidationResult>();
    expectTypeOf<Parameters<FormActions['validate']>>().toEqualTypeOf<[]>();
    expectTypeOf<Parameters<FormActions['validateField']>>().toEqualTypeOf<
      [fieldName: string]
    >();
  });

  it('accepts both new and deprecated rule registration options', () => {
    expectTypeOf<VbenFormAdapterOptions>().toMatchTypeOf<{
      defineRules?: Record<string, unknown>;
      rules?: Record<string, unknown>;
    }>();
  });

  it('supports resolve and legacy dependency contracts', () => {
    const resolveDependencies: FormItemDependencies<AccountFormValues> = {
      resolve({ actions, controller, schema, values }) {
        expectTypeOf(values).toEqualTypeOf<Readonly<AccountFormValues>>();
        expectTypeOf(actions).toEqualTypeOf<FormActions<AccountFormValues>>();
        expectTypeOf(controller).toEqualTypeOf<
          ExtendedFormApi<AccountFormValues>
        >();
        expectTypeOf(schema.fieldName).toEqualTypeOf<string | undefined>();
        return { disabled: !values.email, rules: null };
      },
      triggerFields: ['email'],
    };
    const legacyDependencies: FormItemDependencies<AccountFormValues> = {
      show(values) {
        expectTypeOf(values).toEqualTypeOf<Partial<AccountFormValues>>();
        return Boolean(values.email);
      },
      triggerFields: ['email'],
    };
    const fieldOptions: FormFieldOptions = {
      asyncDebounceMs: 200,
      validateOn: ['blur', 'change'],
    };

    expectTypeOf(resolveDependencies).toMatchTypeOf<
      FormItemDependencies<AccountFormValues>
    >();
    expectTypeOf(legacyDependencies).toMatchTypeOf<
      FormItemDependencies<AccountFormValues>
    >();
    expectTypeOf(fieldOptions).toMatchTypeOf<FormFieldOptions>();
  });

  it('propagates form value types through public APIs and callbacks', () => {
    const options: VbenFormProps<
      BaseFormComponentType,
      Record<never, never>,
      AccountFormValues
    > = {
      handleSubmit(values, rawValues) {
        expectTypeOf(values).toEqualTypeOf<AccountFormValues>();
        expectTypeOf(rawValues).toEqualTypeOf<Readonly<AccountFormValues>>();
      },
      handleValuesChange(values, _fieldsChanged, getFormattedValues) {
        expectTypeOf(values).toEqualTypeOf<Readonly<AccountFormValues>>();
        expectTypeOf(getFormattedValues()).toEqualTypeOf<AccountFormValues>();
      },
      schema: [],
    };
    const [Form, formApi] = useVbenForm<AccountFormValues>(options);

    expectTypeOf(formApi).toEqualTypeOf<ExtendedFormApi<AccountFormValues>>();

    function assertContextApi(
      contextApi: FormContextApi<AccountFormValues>,
      typedFormApi: ExtendedFormApi<AccountFormValues>,
    ) {
      expectTypeOf(
        typedFormApi.getValues(),
      ).resolves.toEqualTypeOf<AccountFormValues>();
      expectTypeOf(
        typedFormApi.getRawValues(),
      ).resolves.toEqualTypeOf<AccountFormValues>();
      expectTypeOf(typedFormApi.getValueSnapshot()).resolves.toEqualTypeOf<{
        rawValues: Readonly<AccountFormValues>;
        values: AccountFormValues;
      }>();
      expectTypeOf(typedFormApi.setValues)
        .parameter(0)
        .toEqualTypeOf<FormValuePatch<AccountFormValues>>();
      expectTypeOf<
        FormValuePatch<AccountFormValues>['profile']
      >().toEqualTypeOf<undefined | { nickname?: string }>();
      expectTypeOf<FormValuePatch<AccountFormValues>['roles']>().toEqualTypeOf<
        string[] | undefined
      >();
      expectTypeOf(typedFormApi.form.values).toEqualTypeOf<AccountFormValues>();
      expectTypeOf(contextApi.getFieldValue('email')).toEqualTypeOf<string>();
      expectTypeOf(
        contextApi.useSelector((state) => state.values.profile.nickname),
      ).toEqualTypeOf<Readonly<import('vue').Ref<string>>>();
    }

    expectTypeOf(assertContextApi).toBeFunction();

    type FormSlots = InstanceType<typeof Form>['$slots'];
    type EmailSlot = NonNullable<FormSlots['email']>;
    type EmailSlotProps = Parameters<EmailSlot>[0];
    type DefaultSlot = NonNullable<FormSlots['default']>;
    type DefaultSlotProps = Parameters<DefaultSlot>[0];

    expectTypeOf<
      EmailSlotProps['field']['state']['value']
    >().toEqualTypeOf<string>();
    expectTypeOf<EmailSlotProps['values']>().toEqualTypeOf<AccountFormValues>();
    expectTypeOf<
      EmailSlotProps['componentProps']['modelValue']
    >().toEqualTypeOf<string | undefined>();
    expectTypeOf<EmailSlotProps['formApi']>().toEqualTypeOf<
      ExtendedFormApi<AccountFormValues>
    >();
    expectTypeOf<
      DefaultSlotProps['values']
    >().toEqualTypeOf<AccountFormValues>();

    const [WideForm] = useVbenForm<Record<string, unknown>>({ schema: [] });
    type WideFormSlots = InstanceType<typeof WideForm>['$slots'];
    type WideFieldSlot = NonNullable<WideFormSlots['dynamic-field']>;
    type WideFieldSlotProps = Parameters<WideFieldSlot>[0];

    expectTypeOf<WideFieldSlotProps>().not.toBeAny();
    expectTypeOf<WideFieldSlotProps['modelValue']>().toEqualTypeOf<unknown>();
    expectTypeOf<
      WideFieldSlotProps['field']['state']['value']
    >().toEqualTypeOf<unknown>();
    expectTypeOf<
      WideFieldSlotProps['componentField']['modelValue']
    >().toEqualTypeOf<unknown>();
    expectTypeOf<WideFieldSlotProps['name']>().toBeString();
    expectTypeOf<WideFieldSlotProps['values']>().toEqualTypeOf<
      Record<string, unknown>
    >();
  });

  it('keeps form and submit values distinct with a codec', () => {
    const options: VbenFormProps<
      BaseFormComponentType,
      Record<never, never>,
      AccountFormValues,
      AccountSubmitValues
    > = {
      codec: {
        decode(values) {
          return {
            email: values.email,
            profile: { nickname: values.nickname },
            roles: values.roles.split(','),
          };
        },
        encode(values) {
          return {
            email: values.email,
            nickname: values.profile.nickname,
            roles: values.roles.join(','),
          };
        },
      },
      handleSubmit(values, rawValues) {
        expectTypeOf(values).toEqualTypeOf<AccountSubmitValues>();
        expectTypeOf(rawValues).toEqualTypeOf<Readonly<AccountFormValues>>();
      },
      handleReset(values) {
        expectTypeOf(values).toEqualTypeOf<AccountSubmitValues>();
      },
      handleValuesChange(values, _fieldsChanged, getFormattedValues) {
        expectTypeOf(values).toEqualTypeOf<Readonly<AccountFormValues>>();
        expectTypeOf(getFormattedValues()).toEqualTypeOf<AccountSubmitValues>();
      },
      schema: [],
    };
    const [, formApi] = useVbenForm<
      AccountFormValues,
      BaseFormComponentType,
      Record<never, never>,
      AccountSubmitValues
    >(options);

    expectTypeOf(
      formApi.getValues(),
    ).resolves.toEqualTypeOf<AccountSubmitValues>();
    expectTypeOf(
      formApi.getRawValues(),
    ).resolves.toEqualTypeOf<AccountFormValues>();
    expectTypeOf(formApi.getValueSnapshot()).resolves.toEqualTypeOf<
      FormValueSnapshot<AccountFormValues, AccountSubmitValues>
    >();
    expectTypeOf(formApi.setSubmitValues)
      .parameter(0)
      .toEqualTypeOf<AccountSubmitValues>();
  });

  it('infers submit values from an inline codec', () => {
    const [, formApi] = useVbenForm({
      codec: {
        decode(values) {
          expectTypeOf(values).toEqualTypeOf<Readonly<AccountSubmitValues>>();
          return {
            email: values.email,
            profile: { nickname: values.nickname },
            roles: values.roles.split(','),
          };
        },
        encode(values: Readonly<AccountFormValues>) {
          return {
            email: values.email,
            nickname: values.profile.nickname,
            roles: values.roles.join(','),
          };
        },
      },
      handleReset(values) {
        expectTypeOf(values).toEqualTypeOf<AccountSubmitValues>();
      },
      handleSubmit(values, rawValues) {
        expectTypeOf(values).toEqualTypeOf<AccountSubmitValues>();
        expectTypeOf(rawValues).toEqualTypeOf<Readonly<AccountFormValues>>();
      },
      schema: [],
    });

    expectTypeOf(
      formApi.getValues(),
    ).resolves.toEqualTypeOf<AccountSubmitValues>();
    expectTypeOf(
      formApi.getRawValues(),
    ).resolves.toEqualTypeOf<AccountFormValues>();
  });

  it('discriminates group schemas from field schemas by type', () => {
    const [, formApi] = useVbenForm<AccountFormValues>({
      schema: [
        { component: 'VbenInput', fieldName: 'email' },
        {
          children: [{ component: 'VbenInput', fieldName: 'profile.nickname' }],
          defaultCollapsed: true,
          title: 'Profile',
          type: 'group',
        },
      ],
    });

    expectTypeOf<FormSchema>().toEqualTypeOf<
      FormFieldSchema | FormGroupSchema
    >();
    expectTypeOf<FormGroupSchema['fieldName']>().toEqualTypeOf<undefined>();
    expectTypeOf<FormGroupSchema['component']>().toEqualTypeOf<undefined>();
    expectTypeOf<FormGroupSchema['children']>().toEqualTypeOf<
      FormFieldSchema[]
    >();
    // updateSchema 只接受字段更新，分组本身不可被更新
    expectTypeOf(formApi.updateSchema)
      .parameter(0)
      .toEqualTypeOf<
        Partial<
          FormFieldSchema<
            BaseFormComponentType,
            Record<never, never>,
            AccountFormValues
          >
        >[]
      >();

    // @ts-expect-error 分组不能声明 fieldName
    const invalidGroup: FormSchema = {
      children: [],
      fieldName: 'group',
      type: 'group',
    };
    // @ts-expect-error 数组子字段不能是分组
    const invalidArrayChildren: FormSchema = {
      children: [{ children: [], type: 'group' }],
      fieldName: 'contacts',
      type: 'array',
    };

    expectTypeOf(invalidGroup).toMatchTypeOf<FormSchema>();
    expectTypeOf(invalidArrayChildren).toMatchTypeOf<FormSchema>();
  });

  it('exposes canonical names alongside deprecated aliases', () => {
    expectTypeOf<FormContextApi['reset']>().toEqualTypeOf<
      FormContextApi['resetForm']
    >();
    expectTypeOf<FormContextApi['submit']>().toEqualTypeOf<
      FormContextApi['submitForm']
    >();
  });
});
