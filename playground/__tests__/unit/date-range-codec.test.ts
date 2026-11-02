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
  it('only accepts optional date range fields', () => {
    interface RangeFieldCandidates extends Record<string, unknown> {
      optionalRange?: [Dayjs, Dayjs];
      optionalText?: string;
      requiredRange: [Dayjs, Dayjs];
    }

    const createCodec = createDateRangeCodec<RangeFieldCandidates>();
    const optionalRangeCodec = createCodec({
      endField: 'end',
      rangeField: 'optionalRange',
      startField: 'start',
    });
    expect(optionalRangeCodec).toEqual({
      decode: expect.any(Function),
      encode: expect.any(Function),
    });
    createCodec({
      endField: 'end',
      // @ts-expect-error A required range cannot be omitted by decode.
      rangeField: 'requiredRange',
      startField: 'start',
    });
    createCodec({
      endField: 'end',
      // @ts-expect-error The range field must contain a DateRange.
      rangeField: 'optionalText',
      startField: 'start',
    });

    interface LooseFieldCandidates extends Record<string, unknown> {
      // any 字段绕过值类型检查，也必须被拒绝
      anyField: any;
      optionalAnyField?: any;
      rangeOrMissing: [Dayjs, Dayjs] | undefined;
    }
    const createLooseCodec = createDateRangeCodec<LooseFieldCandidates>();
    createLooseCodec({
      endField: 'end',
      // @ts-expect-error An `any` field must not be accepted as a range.
      rangeField: 'anyField',
      startField: 'start',
    });
    createLooseCodec({
      endField: 'end',
      // @ts-expect-error An optional `any` field must also be rejected.
      rangeField: 'optionalAnyField',
      startField: 'start',
    });
    createLooseCodec({
      endField: 'end',
      // @ts-expect-error A required `X | undefined` union is not optional.
      rangeField: 'rangeOrMissing',
      startField: 'start',
    });

    // 联合类型参数须逐成员判定：联合中的必填成员不能作为字面量传入
    // （下方 'requiredRange' 报错）。注：TS 对「声明为联合类型的变量」
    // 会延迟求值参数位置的条件类型，任何守卫形态都拦不住此类值——
    // 这是类型系统的已知限制，不另设断言用例。
    const createUnionCodec = createDateRangeCodec<
      LooseFieldCandidates & RangeFieldCandidates
    >();
    createUnionCodec({
      endField: 'end',
      // @ts-expect-error The required member of a union cannot be picked.
      rangeField: 'requiredRange',
      startField: 'start',
    });
  });

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
