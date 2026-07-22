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
    expect(form.submit).toHaveBeenCalledTimes(2);
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
