import type { Component } from 'vue';

import { defineComponent, h, markRaw, onUnmounted } from 'vue';

type AsyncFieldValidator = (...args: any[]) => unknown;

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
        // attrs.name 运行时可能是数字（模板里写字面量），仅接受原始值，
        // 其余类型（symbol/对象）不做 String 强转。
        const rawName = attrs.name;
        const fieldName =
          typeof rawName === 'string' || typeof rawName === 'number'
            ? String(rawName)
            : '';
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
