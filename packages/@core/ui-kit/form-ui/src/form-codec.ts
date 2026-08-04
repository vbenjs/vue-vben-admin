import type { FormCodec, FormValues } from './types';

export type FormCodecPhase = 'decode' | 'encode';

export class FormCodecError extends Error {
  override readonly cause: unknown;
  readonly phase: FormCodecPhase;

  constructor(phase: FormCodecPhase, cause: unknown) {
    super(`[Vben Form] Failed to ${phase} form values.`);
    this.name = 'FormCodecError';
    this.cause = cause;
    this.phase = phase;
  }
}

export function decodeFormValues<
  TFormValues extends FormValues,
  TSubmitValues extends FormValues,
>(
  codec: FormCodec<TFormValues, TSubmitValues>,
  values: Readonly<TSubmitValues>,
) {
  try {
    return codec.decode(values);
  } catch (error) {
    throw new FormCodecError('decode', error);
  }
}

export function encodeFormValues<
  TFormValues extends FormValues,
  TSubmitValues extends FormValues,
>(codec: FormCodec<TFormValues, TSubmitValues>, values: Readonly<TFormValues>) {
  try {
    return codec.encode(values);
  } catch (error) {
    throw new FormCodecError('encode', error);
  }
}
