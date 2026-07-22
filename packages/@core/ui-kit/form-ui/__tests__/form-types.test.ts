import type {
  BaseFormComponentType,
  ExtendedFormApi,
  FormActions,
  FormContextApi,
  FormValidationResult,
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

describe('form public types', () => {
  it('keeps the compatibility alias and stable method signatures', () => {
    expectTypeOf<FormActions>().toEqualTypeOf<FormContextApi>();
    expectTypeOf<FormActions['setFieldValue']>()
      .parameter(0)
      .toMatchTypeOf<string>();
    expectTypeOf<
      FormActions['validate']
    >().returns.resolves.toEqualTypeOf<FormValidationResult>();
  });

  it('accepts both new and deprecated rule registration options', () => {
    expectTypeOf<VbenFormAdapterOptions>().toMatchTypeOf<{
      defineRules?: Record<string, unknown>;
      rules?: Record<string, unknown>;
    }>();
  });

  it('propagates form value types through public APIs and callbacks', () => {
    const options: VbenFormProps<
      BaseFormComponentType,
      Record<never, never>,
      AccountFormValues
    > = {
      handleSubmit(values) {
        expectTypeOf(values).toEqualTypeOf<AccountFormValues>();
      },
      handleValuesChange(values) {
        expectTypeOf(values).toEqualTypeOf<AccountFormValues>();
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
      expectTypeOf(typedFormApi.setValues)
        .parameter(0)
        .toEqualTypeOf<Partial<AccountFormValues>>();
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
    expectTypeOf<EmailSlotProps['formApi']>().toEqualTypeOf<
      ExtendedFormApi<AccountFormValues>
    >();
    expectTypeOf<
      DefaultSlotProps['values']
    >().toEqualTypeOf<AccountFormValues>();
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
