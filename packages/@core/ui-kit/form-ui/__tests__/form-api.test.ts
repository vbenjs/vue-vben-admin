import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FormApi } from '../src/form-api';

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
    expect(formApi.getFieldComponentRef('name')).toBeUndefined();
  });

  it('should get values from form', async () => {
    const formActions: any = {
      meta: {},
      values: { name: 'test' },
    };

    await formApi.mount(formActions, new Map());
    const values = await formApi.getValues();
    expect(values).toEqual({ name: 'test' });
  });

  it('should format schema values when getting values', async () => {
    formApi.setState({
      schema: [
        {
          component: 'range-picker',
          fieldName: 'filters.range',
          valueFormat: (value, setValue) => {
            setValue('filters.startTime', value?.[0]);
            setValue('filters.endTime', value?.[1]);
          },
        },
      ],
    });

    const formActions: any = {
      meta: {},
      values: {
        filters: {
          range: [1_710_000_000_000, 1_720_000_000_000],
        },
      },
    };
    const originalValuesSnapshot = structuredClone(formActions.values);

    await formApi.mount(formActions, new Map());

    expect(formApi.getLatestSubmissionValues()).toEqual({
      filters: {
        endTime: 1_720_000_000_000,
        startTime: 1_710_000_000_000,
      },
    });

    const values = await formApi.getValues();
    expect(values).toEqual({
      filters: {
        endTime: 1_720_000_000_000,
        startTime: 1_710_000_000_000,
      },
    });
    expect(formActions.values).toEqual(originalValuesSnapshot);
  });

  it('should set field value', async () => {
    const setFieldValueMock = vi.fn();
    const formActions: any = {
      meta: {},
      setFieldValue: setFieldValueMock,
      values: { name: 'test' },
    };

    await formApi.mount(formActions, new Map());
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

    await formApi.mount(formActions, new Map());
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
    await formApi.mount(formActions, new Map());

    const result = await formApi.submitForm();
    expect(formActions.submitForm).toHaveBeenCalled();
    expect(handleSubmitMock).toHaveBeenCalledWith({ name: 'test' });
    expect(result).toEqual({ name: 'test' });
  });

  it('should unmount form and reset state', () => {
    formApi.unmount();
    expect(formApi.isMounted).toBe(false);
  });

  it('should clear component refs on unmount before mounting again', async () => {
    const formActions: any = {
      meta: {},
      resetForm: vi.fn(),
      values: { name: 'test' },
    };
    const staleMap = new Map<string, unknown>([
      [
        'name',
        {
          $: {
            type: { name: 'MockComponent' },
          },
          $el: {},
        },
      ],
    ]);

    await formApi.mount(formActions, staleMap);
    expect(formApi.getFieldComponentRef('name')).toEqual({
      $: {
        type: { name: 'MockComponent' },
      },
      $el: {},
    });

    formApi.unmount();
    expect(formApi.getFieldComponentRef('name')).toBeUndefined();

    await formApi.mount(formActions);
    expect(formApi.getFieldComponentRef('name')).toBeUndefined();
  });

  it('should validate form', async () => {
    const validateMock = vi.fn().mockResolvedValue(true);
    const formActions: any = {
      meta: {},
      validate: validateMock,
    };

    await formApi.mount(formActions, new Map());
    const isValid = await formApi.validate();
    expect(validateMock).toHaveBeenCalled();
    expect(isValid).toBe(true);
  });
});

describe('updateSchema', () => {
  let instance: FormApi;

  beforeEach(() => {
    instance = new FormApi();
    instance.state = {
      schema: [
        { component: 'text', fieldName: 'name' },
        { component: 'number', fieldName: 'age', label: 'Age' },
      ],
    };
  });

  it('should update the schema correctly when fieldName matches', () => {
    const newSchema = [
      { component: 'text', fieldName: 'name' },
      { component: 'number', fieldName: 'age', label: 'Age' },
    ];

    instance.updateSchema(newSchema);

    expect(instance.state?.schema?.[0]?.component).toBe('text');
    expect(instance.state?.schema?.[1]?.label).toBe('Age');
  });

  it('should log an error if fieldName is missing in some items', () => {
    const newSchema: any[] = [
      { component: 'textarea', fieldName: 'name' },
      { component: 'number' },
    ];

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    instance.updateSchema(newSchema);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'All items in the schema array must have a valid `fieldName` property to be updated',
    );
  });

  it('should not update schema if fieldName does not match', () => {
    const newSchema = [{ component: 'textarea', fieldName: 'unknown' }];

    instance.updateSchema(newSchema);

    expect(instance.state?.schema?.[0]?.component).toBe('text');
    expect(instance.state?.schema?.[1]?.component).toBe('number');
  });

  it('should not update schema if updatedMap is empty', () => {
    const newSchema: any[] = [{ component: 'textarea' }];

    instance.updateSchema(newSchema);

    expect(instance.state?.schema?.[0]?.component).toBe('text');
    expect(instance.state?.schema?.[1]?.component).toBe('number');
  });
});
