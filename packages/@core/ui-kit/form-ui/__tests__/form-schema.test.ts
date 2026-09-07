import type { FormSchema } from '../src/types';

import { describe, expect, it, vi } from 'vitest';

import {
  createArrayChildSchema,
  createFormFieldSchema,
  getFormFieldSchemas,
  isFormGroupSchema,
  removeFormSchemaByFields,
  updateFormSchemaList,
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

describe('form group schema', () => {
  const nameSchema: FormSchema = { component: 'VbenInput', fieldName: 'name' };
  const contactGroup: FormSchema = {
    children: [
      { component: 'VbenInput', fieldName: 'email' },
      { component: 'VbenInput', fieldName: 'phone' },
    ],
    name: 'contact',
    title: 'Contact',
    type: 'group',
  };
  const tagsArray: FormSchema = {
    children: [{ component: 'VbenInput', fieldName: 'label' }],
    fieldName: 'tags',
    type: 'array',
  };
  const schema: FormSchema[] = [nameSchema, contactGroup, tagsArray];

  it('distinguishes groups from fields and arrays', () => {
    expect(isFormGroupSchema(nameSchema)).toBe(false);
    expect(isFormGroupSchema(contactGroup)).toBe(true);
    expect(isFormGroupSchema(tagsArray)).toBe(false);
  });

  it('flattens groups into field schemas while keeping arrays intact', () => {
    const fields = getFormFieldSchemas(schema);

    expect(fields.map((item) => item.fieldName)).toEqual([
      'name',
      'email',
      'phone',
      'tags',
    ]);
    expect(fields[3]).toBe(schema[2]);
  });

  it('updates fields nested inside groups', () => {
    const updated = updateFormSchemaList(schema, [
      { fieldName: 'phone', label: 'Phone' },
      { fieldName: 'tags.label', label: 'Tag' },
    ]);

    expect(updated[0]).toBe(schema[0]);
    expect(updated[1]).toMatchObject({
      children: [
        { fieldName: 'email' },
        { fieldName: 'phone', label: 'Phone' },
      ],
      name: 'contact',
      type: 'group',
    });
    expect(updated[2]).toMatchObject({
      children: [{ fieldName: 'label', label: 'Tag' }],
      fieldName: 'tags',
    });
    // 原 schema 不应被修改
    expect(schema[1]).not.toHaveProperty('children.1.label');
  });

  it('removes fields nested inside groups without dropping the group', () => {
    const result = removeFormSchemaByFields(schema, ['name', 'email']);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      children: [{ fieldName: 'phone' }],
      name: 'contact',
      type: 'group',
    });
    expect(result[1]).toBe(schema[2]);
  });
});
