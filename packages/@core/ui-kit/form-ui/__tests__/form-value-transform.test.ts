import { describe, expect, it } from 'vitest';

import {
  applyFormValueFormats,
  formatFormValues,
  transformRangeTimeValues,
} from '../src/form-value-transform';

describe('form value transforms', () => {
  it('maps array and range fields without mutating input values', () => {
    const input = {
      period: [1_710_000_000_000, 1_720_000_000_000],
      tags: ['admin', 'editor'],
    };

    const result = transformRangeTimeValues(
      input,
      [['period', ['startTime', 'endTime'], null]],
      ['tags'],
    );

    expect(result).toEqual({
      endTime: 1_720_000_000_000,
      startTime: 1_710_000_000_000,
      tags: 'admin,editor',
    });
    expect(input).toEqual({
      period: [1_710_000_000_000, 1_720_000_000_000],
      tags: ['admin', 'editor'],
    });
  });

  it('formats array children with row and root paths', () => {
    const values = {
      contacts: [{ name: ' Ada ' }, { name: ' Grace ' }],
    };
    const schema = [
      {
        children: [
          {
            component: 'text',
            fieldName: 'name',
            valueFormat(value: string, setValue: any, _values: any, ctx: any) {
              setValue('$row.normalizedName', value.trim());
              setValue('$root.lastRow', ctx.rowIndex);
            },
          },
        ],
        fieldName: 'contacts',
        type: 'array',
      },
    ] as any;

    const result = applyFormValueFormats(values, schema);

    expect(result).toEqual({
      contacts: [{ normalizedName: 'Ada' }, { normalizedName: 'Grace' }],
      lastRow: 1,
    });
    expect(values).toEqual({
      contacts: [{ name: ' Ada ' }, { name: ' Grace ' }],
    });
  });

  it('runs the unified formatting pipeline in a stable order', () => {
    const result = formatFormValues(
      {
        period: [1, 2],
        tags: ['admin', 'editor'],
        title: ' Ada ',
      },
      [
        {
          component: 'text',
          fieldName: 'title',
          valueFormat: (value: string) => value.trim(),
        },
      ],
      [['period', ['startTime', 'endTime'], null]],
      ['tags'],
    );

    expect(result).toEqual({
      endTime: 2,
      startTime: 1,
      tags: 'admin,editor',
      title: 'Ada',
    });
  });
});
