import type { Component } from 'vue';

import { defineComponent, h, markRaw, onUnmounted } from 'vue';

type AsyncFieldValidator = (...args: any[]) => Promise<unknown> | unknown;

export type FieldValidationInvalidator = () => void;

const asyncValidatorKeys = [
  'onBlurAsync',
  'onChangeAsync',
  'onDynamicAsync',
  'onSubmitAsync',
] as const;

export function createRuntimeFieldComponent(
  fieldComponent: Component,
  registerInvalidator: (
    fieldName: string,
    invalidator: FieldValidationInvalidator,
  ) => () => void,
) {
  return markRaw(
    defineComponent({
      inheritAttrs: false,
      setup(_, { attrs, slots }) {
        const fieldName = String(attrs.name ?? '');
        let validationRunId = 0;
        let cachedValidators: Record<string, any> | undefined;
        let cachedWrappedValidators: Record<string, any> | undefined;
        const unregisterInvalidator = registerInvalidator(fieldName, () => {
          validationRunId += 1;
        });
        onUnmounted(unregisterInvalidator);

        function wrapValidators(validators: Record<string, any>) {
          if (validators === cachedValidators && cachedWrappedValidators) {
            return cachedWrappedValidators;
          }
          const wrappedValidators = { ...validators };
          for (const key of asyncValidatorKeys) {
            const validator = validators[key] as
              | AsyncFieldValidator
              | undefined;
            if (!validator) {
              continue;
            }
            wrappedValidators[key] = async (...args: any[]) => {
              const currentValidationRunId = ++validationRunId;
              const result = await validator(...args);
              return currentValidationRunId === validationRunId
                ? result
                : undefined;
            };
          }
          cachedValidators = validators;
          cachedWrappedValidators = wrappedValidators;
          return wrappedValidators;
        }

        return () => {
          const validators = attrs.validators as
            | Record<string, any>
            | undefined;
          return h(
            fieldComponent,
            {
              ...attrs,
              ...(validators ? { validators: wrapValidators(validators) } : {}),
            },
            slots,
          );
        };
      },
    }),
  );
}
