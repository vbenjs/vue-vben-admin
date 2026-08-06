import type { BaseFormComponentType } from '../src/types';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { setupVbenForm } from '../src/config';
import {
  resetDeprecationWarnings,
  warnDeprecatedOnce,
} from '../src/deprecation';
import { FormApi } from '../src/form-api';
import { getFormRule } from '../src/rule-registry';

afterEach(() => {
  resetDeprecationWarnings();
  vi.restoreAllMocks();
});

describe('form api compatibility', () => {
  it('keeps deprecated value transforms and warns once per API', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const formApi = new FormApi({
      arrayToStringFields: ['tags'],
      fieldMappingTime: [['period', ['startTime', 'endTime'], null]],
      schema: [
        {
          component: 'input',
          fieldName: 'name',
          valueFormat: (value: string) => value.trim(),
        },
      ],
    });
    const form = {
      meta: {},
      values: {
        name: ' Ada ',
        period: [1, 2],
        tags: ['admin', 'user'],
      },
    } as any;

    formApi.mount(form);

    expect(await formApi.getValues()).toEqual({
      endTime: 2,
      name: 'Ada',
      startTime: 1,
      tags: 'admin,user',
    });
    expect(warning).toHaveBeenCalledTimes(3);
    expect(warning).toHaveBeenCalledWith(
      '[Vben Form] `schema.valueFormat` is deprecated. Use the form-level `codec` instead.',
    );
    expect(warning).toHaveBeenCalledWith(
      '[Vben Form] `fieldMappingTime` is deprecated. Use the form-level `codec` instead.',
    );
    expect(warning).toHaveBeenCalledWith(
      '[Vben Form] `arrayToStringFields` is deprecated. Use the form-level `codec` instead.',
    );
  });

  it('prefers the codec when deprecated transforms are also configured', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const formApi = new FormApi<
      { name: string },
      BaseFormComponentType,
      Record<never, never>,
      { normalizedName: string }
    >({
      codec: {
        decode(values) {
          return { name: values.normalizedName };
        },
        encode(values) {
          return { normalizedName: values.name.toUpperCase() };
        },
      },
      schema: [
        {
          component: 'input',
          fieldName: 'name',
          valueFormat: () => 'legacy',
        },
      ],
    });
    const form = { meta: {}, values: { name: 'Ada' } } as any;

    formApi.mount(form);

    expect(await formApi.getValues()).toEqual({ normalizedName: 'ADA' });
    expect(warning).toHaveBeenCalledOnce();
    expect(warning).toHaveBeenCalledWith(
      '[Vben Form] The form `codec` takes precedence over deprecated `valueFormat`, `fieldMappingTime`, and `arrayToStringFields` options.',
    );
  });

  it('forwards defineRules and warns only once in development', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const legacyRule = () => 'legacy error';

    setupVbenForm({ defineRules: { legacy: legacyRule } });
    setupVbenForm({ defineRules: { legacy: legacyRule } });

    expect(warning).toHaveBeenCalledOnce();
    expect(warning).toHaveBeenCalledWith(
      '[Vben Form] `setupVbenForm({ defineRules })` is deprecated. Use `setupVbenForm({ rules })` instead.',
    );
    const registeredRule = getFormRule('legacy');
    expect(registeredRule).toBeDefined();
    if (!registeredRule) return;
    expect(
      await registeredRule('', [], {
        field: { name: 'legacy' },
        name: 'legacy',
      }),
    ).toBe('legacy error');
  });

  it('prefers the new rules option when both APIs define the same rule', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    setupVbenForm({
      defineRules: { required: () => 'legacy error' },
      rules: { required: () => 'new error' },
    });

    const registeredRule = getFormRule('required');
    expect(registeredRule).toBeDefined();
    if (!registeredRule) return;
    expect(
      await registeredRule('', [], {
        field: { name: 'required' },
        name: 'required',
      }),
    ).toBe('new error');
  });

  it('does not emit deprecation warnings in production', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});

    warnDeprecatedOnce('legacy-api', 'deprecated', { production: true });

    expect(warning).not.toHaveBeenCalled();
  });

  it('keeps legacy form methods and warns once for each name', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const formApi = new FormApi();
    const form = {
      clearValidation: vi.fn(),
      meta: {},
      reset: vi.fn(),
      submit: vi.fn(),
      validate: vi.fn().mockResolvedValue({ errors: {}, valid: true }),
      values: { name: 'Ada' },
    } as any;
    formApi.mount(form);

    await formApi.resetForm();
    await formApi.resetForm();
    await formApi.resetValidate();
    await formApi.submitForm();
    await formApi.validateAndSubmitForm();

    expect(form.reset).toHaveBeenCalledTimes(2);
    expect(form.clearValidation).toHaveBeenCalledOnce();
    expect(form.submit).toHaveBeenCalledOnce();
    expect(warning).toHaveBeenCalledTimes(4);
    expect(warning).toHaveBeenCalledWith(
      '[Vben Form] `formApi.resetForm()` is deprecated. Use `formApi.reset()` instead.',
    );
    expect(warning).toHaveBeenCalledWith(
      '[Vben Form] `formApi.resetValidate()` is deprecated. Use `formApi.clearValidation()` instead.',
    );
    expect(warning).toHaveBeenCalledWith(
      '[Vben Form] `formApi.submitForm()` is deprecated. Use `formApi.submit()` instead.',
    );
    expect(warning).toHaveBeenCalledWith(
      '[Vben Form] `formApi.validateAndSubmitForm()` is deprecated. Use `formApi.validateAndSubmit()` instead.',
    );
  });
});
