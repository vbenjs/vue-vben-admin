import type {
  FormActions,
  FormFieldName,
  FormFieldValue,
  FormResetOptions,
  FormRuntimeState,
  FormValues,
} from './types';

import { computed, markRaw } from 'vue';

import { useForm } from '@tanstack/vue-form';

function normalizeError(error: unknown): string | undefined {
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const message = Reflect.get(error, 'message');
    return typeof message === 'string' ? message : undefined;
  }
  return error === undefined || error === null ? undefined : String(error);
}

export function useFormRuntime<TValues extends FormValues>(
  defaultValues: TValues,
): FormActions<TValues> {
  const rawForm = useForm({
    defaultValues,
    onSubmit: () => {},
  });
  const state = rawForm.useSelector((formState) => formState);

  function getErrors() {
    const result: Record<string, string> = {};
    const allErrors = rawForm.getAllErrors();
    for (const [fieldName, fieldErrors] of Object.entries(allErrors.fields)) {
      const errors =
        fieldErrors &&
        typeof fieldErrors === 'object' &&
        'errors' in fieldErrors &&
        Array.isArray(fieldErrors.errors)
          ? fieldErrors.errors
          : [];
      const error = normalizeError(errors[0]);
      if (error) {
        result[fieldName] = error;
      }
    }
    return result;
  }

  const runtimeState = computed<FormRuntimeState<TValues>>(() => ({
    errors: getErrors(),
    meta: {
      dirty: state.value.isDirty,
      submitting: state.value.isSubmitting,
      valid: state.value.isValid,
      validating: state.value.isValidating,
    },
    values: state.value.values,
  }));

  async function validateField(fieldName: string) {
    await rawForm.validateField(fieldName as never, 'submit');
    const error = getErrors()[fieldName];
    return {
      errors: error ? { [fieldName]: error } : {},
      valid: !error,
    };
  }

  async function validate() {
    await rawForm.validateAllFields('submit');
    const errors = getErrors();
    return {
      errors,
      valid: Object.keys(errors).length === 0,
    };
  }

  function abortFieldValidation(fieldName: string) {
    const fieldInfo = rawForm.getFieldInfo(fieldName as never);
    for (const validationMeta of Object.values(fieldInfo.validationMetaMap)) {
      validationMeta?.lastAbortController.abort();
    }
  }

  function setFieldError(fieldName: string, error?: string) {
    abortFieldValidation(fieldName);
    rawForm.setFieldMeta(fieldName as never, (meta) => {
      const currentMeta = meta ?? {
        _arrayVersion: 0,
        _pendingValidationsCount: 0,
        errorMap: {},
        errorSourceMap: {},
        isBlurred: false,
        isDirty: false,
        isTouched: false,
        isValidating: false,
      };
      return {
        ...currentMeta,
        errorMap: error ? { ...currentMeta.errorMap, onSubmit: error } : {},
        errorSourceMap: error ? currentMeta.errorSourceMap : {},
      };
    });
  }

  function clearValidation(
    fieldNames?: FormFieldName<TValues> | FormFieldName<TValues>[],
  ) {
    const requestedFieldNames = Array.isArray(fieldNames)
      ? fieldNames
      : fieldNames
        ? [fieldNames]
        : undefined;
    const targetFieldNames = requestedFieldNames ?? [
      ...new Set([
        ...Object.keys(rawForm.fieldInfo),
        ...Object.keys(rawForm.getAllErrors().fields),
      ]),
    ];

    for (const fieldName of targetFieldNames) {
      setFieldError(fieldName, undefined);
    }
  }

  async function reset(
    resetState?: { values?: Partial<TValues> },
    options?: FormResetOptions,
  ) {
    rawForm.reset(resetState?.values as TValues | undefined, options);
  }

  async function submit() {
    await rawForm.handleSubmit();
  }

  const actions: FormActions<TValues> = {
    clearValidation,
    get errors() {
      return runtimeState.value.errors;
    },
    fieldComponent: markRaw(rawForm.Field),
    get meta() {
      return runtimeState.value.meta;
    },
    get values() {
      return runtimeState.value.values;
    },
    getFieldError(fieldName) {
      return getErrors()[fieldName];
    },
    getFieldValue(fieldName) {
      return rawForm.getFieldValue(fieldName as never) as FormFieldValue<
        TValues,
        typeof fieldName
      >;
    },
    handleSubmit(callback) {
      return async (event) => {
        event?.preventDefault();
        event?.stopPropagation();
        const result = await validate();
        if (result.valid) {
          await callback(runtimeState.value.values);
        }
      };
    },
    isFieldValid(fieldName) {
      return !getErrors()[fieldName];
    },
    pushFieldValue(fieldName, value) {
      rawForm.pushFieldValue(fieldName as never, value as never);
    },
    async removeFieldValue(fieldName, index) {
      await rawForm.removeFieldValue(fieldName as never, index);
    },
    reset,
    resetForm: reset,
    setFieldError,
    async setFieldValue(fieldName, value, shouldValidate) {
      rawForm.setFieldValue(fieldName as never, value as never, {
        dontValidate: !shouldValidate,
      });
      if (shouldValidate) {
        await validateField(fieldName);
      }
    },
    async setValues(values, shouldValidate) {
      for (const [fieldName, value] of Object.entries(values)) {
        rawForm.setFieldValue(fieldName as never, value as never, {
          dontValidate: !shouldValidate,
        });
      }
      if (shouldValidate) {
        await validate();
      }
    },
    submit,
    submitForm: submit,
    useSelector(selector) {
      return computed(() => selector(runtimeState.value));
    },
    validate,
    validateField,
  };

  return actions;
}
