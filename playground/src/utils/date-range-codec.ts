import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';

type DateRange = [Dayjs, Dayjs];

// 显式探测 any：任何与 any 的交叉都退化为 any，0 extends 1 & V 仅在
// V 为 any 时成立。
type IsAny<V> = 0 extends 1 & V ? true : false;

// 仅当字段在 TFormValues 中是「可选属性」且值类型为 DateRange 时才能被
// 选作区间字段。TRangeField 为裸类型参数，联合成员逐一判定（否则
// 「可选 | 必填」的联合会因合并 Pick 含可选属性而整体通过）。用 Pick 与
// Required<Pick> 的可赋值性探测可选性：必填字段（含显式 X | undefined
// 联合）二者同型会被判为必填而拒绝；any（必填或可选）经 IsAny 显式
// 拒绝——它绕过一切值类型检查，不应被当作区间字段接受。已知限制：
// 声明为联合类型的变量因条件类型延迟求值仍可传入（字面量会被拦）。
type OptionalDateRangeField<
  TFormValues extends Record<string, unknown>,
  TRangeField extends keyof TFormValues,
> = TRangeField extends keyof TFormValues
  ? IsAny<TFormValues[TRangeField]> extends true
    ? never
    : Pick<TFormValues, TRangeField> extends Required<
          Pick<TFormValues, TRangeField>
        >
      ? never
      : [Exclude<TFormValues[TRangeField], undefined>] extends [never]
        ? never
        : Exclude<TFormValues[TRangeField], undefined> extends DateRange
          ? TRangeField
          : never
  : never;

type DateRangeSubmitValues<
  TFormValues extends Record<string, unknown>,
  TRangeField extends keyof TFormValues,
  TStartField extends string,
  TEndField extends string,
> = Omit<TFormValues, TRangeField> &
  Record<TEndField | TStartField, string | undefined>;

interface DateRangeCodecOptions<
  TFormValues extends Record<string, unknown>,
  TRangeField extends keyof TFormValues & string,
  TStartField extends string,
  TEndField extends string,
> {
  endField: TEndField;
  rangeField: OptionalDateRangeField<TFormValues, TRangeField> & TRangeField;
  startField: TStartField;
}

export function createDateRangeCodec<
  TFormValues extends Record<string, unknown>,
>() {
  return function createCodec<
    TRangeField extends keyof TFormValues & string,
    TStartField extends string,
    TEndField extends string,
  >(
    options: DateRangeCodecOptions<
      TFormValues,
      TRangeField,
      TStartField,
      TEndField
    >,
  ) {
    const { endField, startField } = options;
    const rangeField = options.rangeField as TRangeField;
    type SubmitValues = DateRangeSubmitValues<
      TFormValues,
      TRangeField,
      TStartField,
      TEndField
    >;

    return {
      decode(values: Readonly<SubmitValues>): TFormValues {
        const { [endField]: end, [startField]: start, ...formValues } = values;
        return {
          ...formValues,
          ...(start && end ? { [rangeField]: [dayjs(start), dayjs(end)] } : {}),
        } as TFormValues;
      },
      encode(values: Readonly<TFormValues>): SubmitValues {
        const { [rangeField]: value, ...formValues } = values;
        const range = value as DateRange | undefined;
        return {
          ...formValues,
          [endField]: range?.[1]?.format('YYYY-MM-DD'),
          [startField]: range?.[0]?.format('YYYY-MM-DD'),
        } as SubmitValues;
      },
    };
  };
}
