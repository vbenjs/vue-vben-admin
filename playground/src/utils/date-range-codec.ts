import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';

type DateRange = [Dayjs, Dayjs];

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
  rangeField: TRangeField;
  startField: TStartField;
}

export function createDateRangeCodec<
  TFormValues extends Record<string, unknown>,
>() {
  return function createCodec<
    TRangeField extends keyof TFormValues & string,
    TStartField extends string,
    TEndField extends string,
  >({
    endField,
    rangeField,
    startField,
  }: DateRangeCodecOptions<TFormValues, TRangeField, TStartField, TEndField>) {
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
