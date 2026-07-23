import type { FormCodec } from '../src/types';

import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  decodeFormValues,
  encodeFormValues,
  FormCodecError,
} from '../src/form-codec';

interface FilterFormValues {
  period: [number, number];
  tags: string[];
}

interface FilterSubmitValues {
  endTime: number;
  startTime: number;
  tags: string;
}

const filterCodec: FormCodec<FilterFormValues, FilterSubmitValues> = {
  decode(values) {
    return {
      period: [values.startTime, values.endTime],
      tags: values.tags ? values.tags.split(',') : [],
    };
  },
  encode(values) {
    return {
      endTime: values.period[1],
      startTime: values.period[0],
      tags: values.tags.join(','),
    };
  },
};

describe('form codec', () => {
  it('encodes and decodes complete form values', () => {
    const submitValues = encodeFormValues(filterCodec, {
      period: [1, 2],
      tags: ['admin', 'user'],
    });

    expect(submitValues).toEqual({
      endTime: 2,
      startTime: 1,
      tags: 'admin,user',
    });
    expect(decodeFormValues(filterCodec, submitValues)).toEqual({
      period: [1, 2],
      tags: ['admin', 'user'],
    });
    expectTypeOf(submitValues).toEqualTypeOf<FilterSubmitValues>();
  });

  it('reports the failed codec phase without mutating inputs', () => {
    const values = Object.freeze({ period: [1, 2], tags: ['admin'] }) as {
      period: [number, number];
      tags: string[];
    };
    const codec: FormCodec<FilterFormValues, FilterSubmitValues> = {
      decode: filterCodec.decode,
      encode() {
        throw new Error('broken encoder');
      },
    };

    expect(() => encodeFormValues(codec, values)).toThrowError(FormCodecError);

    let codecError: unknown;
    try {
      encodeFormValues(codec, values);
    } catch (error) {
      codecError = error;
    }
    expect(codecError).toBeInstanceOf(FormCodecError);
    expect(codecError).toMatchObject({ phase: 'encode' });
    expect(values).toEqual({ period: [1, 2], tags: ['admin'] });
  });
});
