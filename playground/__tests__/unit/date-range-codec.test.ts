import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';

import { createDateRangeCodec } from '../../src/utils/date-range-codec';

interface SearchFormValues extends Record<string, unknown> {
  createdAt?: [Dayjs, Dayjs];
  keyword?: string;
}

const codec = createDateRangeCodec<SearchFormValues>()({
  endField: 'finishedAt',
  rangeField: 'createdAt',
  startField: 'startedAt',
});

describe('date range codec', () => {
  it('encodes and decodes configurable date range fields', () => {
    const submitValues = codec.encode({
      createdAt: [dayjs('2026-07-01'), dayjs('2026-07-23')],
      keyword: 'admin',
    });

    expect(submitValues).toEqual({
      finishedAt: '2026-07-23',
      keyword: 'admin',
      startedAt: '2026-07-01',
    });
    const formValues = codec.decode(submitValues);
    expect(formValues.keyword).toBe('admin');
    expect(
      formValues.createdAt?.map((value) => value.format('YYYY-MM-DD')),
    ).toEqual(['2026-07-01', '2026-07-23']);
  });

  it('does not reconstruct a range with a missing bound', () => {
    expect(
      codec.decode({
        finishedAt: undefined,
        keyword: 'admin',
        startedAt: '2026-07-01',
      }),
    ).toEqual({ keyword: 'admin' });
  });
});
