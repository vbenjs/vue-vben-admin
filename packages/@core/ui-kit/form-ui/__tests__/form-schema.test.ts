import { describe, expect, it, vi } from 'vitest';

import {
  createArrayChildSchema,
  createFormFieldSchema,
} from '../src/form-render/schema';

describe('form schema normalization', () => {
  it('resolves common component props with the field context', () => {
    const componentProps = vi.fn(({ fieldName }) => ({
      placeholder: `Enter ${fieldName}`,
    }));

    const schema = createFormFieldSchema(
      { component: 'VbenInput', fieldName: 'name' },
      { commonConfig: { componentProps } },
    );

    expect(componentProps).toHaveBeenCalledWith({ fieldName: 'name' });
    expect(schema.commonComponentProps).toEqual({
      placeholder: 'Enter name',
    });
  });

  it('preserves common component props objects', () => {
    const schema = createFormFieldSchema(
      { component: 'VbenInput', fieldName: 'name' },
      { commonConfig: { componentProps: { placeholder: 'Enter a name' } } },
    );

    expect(schema.commonComponentProps).toEqual({
      placeholder: 'Enter a name',
    });
  });

  it('resolves global common component props functions', () => {
    const componentProps = vi.fn(({ fieldName }) => ({
      title: `Global ${fieldName}`,
    }));

    const schema = createFormFieldSchema(
      { component: 'VbenInput', fieldName: 'email' },
      { globalCommonConfig: { componentProps } },
    );

    expect(componentProps).toHaveBeenCalledWith({ fieldName: 'email' });
    expect(schema.commonComponentProps).toEqual({ title: 'Global email' });
  });

  it('resolves array common props with the row context', () => {
    const componentProps = vi.fn(() => ({ placeholder: 'Contact name' }));

    const schema = createArrayChildSchema(
      { component: 'VbenInput', fieldName: 'name' },
      {
        arrayField: 'contacts',
        commonConfig: { componentProps },
        index: 1,
      },
    );

    expect(componentProps).toHaveBeenCalledWith({
      arrayField: 'contacts',
      fieldName: 'contacts[1].name',
      originalFieldName: 'name',
      rowIndex: 1,
      rowPath: 'contacts[1]',
    });
    expect(schema.commonComponentProps).toEqual({
      placeholder: 'Contact name',
    });
  });
});
