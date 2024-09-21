// 假设这个文件为 FormApi.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FormApi } from '../src/form-api';

vi.mock('@vben-core/shared/utils', () => ({
  bindMethods: vi.fn(),
  createMerge: vi.fn((mergeFn) => {
    return (stateOrFn, prev) => {
      mergeFn(prev, 'key', stateOrFn);
      return { ...prev, ...stateOrFn };
    };
  }),
  isFunction: (fn: any) => typeof fn === 'function',
  StateHandler: vi.fn().mockImplementation(() => ({
    reset: vi.fn(),
    setConditionTrue: vi.fn(),
    waitForCondition: vi.fn().mockResolvedValue(true),
  })),
}));

describe('formApi', () => {
  let formApi: FormApi;

  beforeEach(() => {
    formApi = new FormApi();
  });

  it('should initialize with default state', () => {
    expect(formApi.state).toEqual(
      expect.objectContaining({
        actionWrapperClass: '',
        collapsed: false,
        collapsedRows: 1,
        commonConfig: {},
        handleReset: undefined,
        handleSubmit: undefined,
        layout: 'horizontal',
        resetButtonOptions: {},
        schema: [],
        showCollapseButton: false,
        showDefaultActions: true,
        submitButtonOptions: {},
        wrapperClass: 'grid-cols-1',
      }),
    );
    expect(formApi.isMounted).toBe(false);
  });

  it('should mount form actions', async () => {
    const formActions: any = {
      meta: {},
      resetForm: vi.fn(),
      setFieldValue: vi.fn(),
      setValues: vi.fn(),
      submitForm: vi.fn(),
      validate: vi.fn(),
      values: { name: 'test' },
    };

    await formApi.mount(formActions);
    expect(formApi.isMounted).toBe(true);
    expect(formApi.form).toEqual(formActions);
  });

  it('should get values from form', async () => {
    const formActions: any = {
      meta: {},
      values: { name: 'test' },
    };

    await formApi.mount(formActions);
    const values = await formApi.getValues();
    expect(values).toEqual({ name: 'test' });
  });

  it('should set field value', async () => {
    const setFieldValueMock = vi.fn();
    const formActions: any = {
      meta: {},
      setFieldValue: setFieldValueMock,
      values: { name: 'test' },
    };

    await formApi.mount(formActions);
    await formApi.setFieldValue('name', 'new value');
    expect(setFieldValueMock).toHaveBeenCalledWith(
      'name',
      'new value',
      undefined,
    );
  });

  it('should reset form', async () => {
    const resetFormMock = vi.fn();
    const formActions: any = {
      meta: {},
      resetForm: resetFormMock,
      values: { name: 'test' },
    };

    await formApi.mount(formActions);
    await formApi.resetForm();
    expect(resetFormMock).toHaveBeenCalled();
  });

  it('should call handleSubmit on submit', async () => {
    const handleSubmitMock = vi.fn();
    const formActions: any = {
      meta: {},
      submitForm: vi.fn().mockResolvedValue(true),
      values: { name: 'test' },
    };

    const state = {
      handleSubmit: handleSubmitMock,
    };

    formApi.setState(state);
    await formApi.mount(formActions);

    const result = await formApi.submitForm();
    expect(formActions.submitForm).toHaveBeenCalled();
    expect(handleSubmitMock).toHaveBeenCalledWith({ name: 'test' });
    expect(result).toEqual({ name: 'test' });
  });

  it('should unmount form and reset state', () => {
    formApi.unmounted();
    expect(formApi.isMounted).toBe(false);
    expect(formApi.stateHandler.reset).toHaveBeenCalled();
  });

  it('should validate form', async () => {
    const validateMock = vi.fn().mockResolvedValue(true);
    const formActions: any = {
      meta: {},
      validate: validateMock,
    };

    await formApi.mount(formActions);
    const isValid = await formApi.validate();
    expect(validateMock).toHaveBeenCalled();
    expect(isValid).toBe(true);
  });
});
