<script setup lang="ts">
import type { GenericObject } from 'vee-validate';
import type { ZodTypeAny } from 'zod';

import type { FormRenderProps, FormSchema, FormShape } from '../types';

import { computed } from 'vue';

import { Form } from '@vben-core/shadcn-ui';
import { cn } from '@vben-core/shared/utils';

import { provideFormRenderProps } from './context';
import { useExpandable } from './expandable';
import FormField from './form-field.vue';
import { getBaseRules, getDefaultValueInZodStack } from './helper';

interface Props extends FormRenderProps {}

const props = withDefaults(defineProps<Props>(), {
  collapsedRows: 1,
  commonConfig: () => ({}),
  expandable: false,
  gridClass: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
});

const emits = defineEmits<{
  submit: [event: any];
}>();

provideFormRenderProps(props);

const { keepFormItemIndex, wrapperRef } = useExpandable(props);

const shapes = computed(() => {
  const resultShapes: FormShape[] = [];
  props.schema?.forEach((schema) => {
    const { fieldName } = schema;
    const rules = schema.rules as ZodTypeAny;
    let typeName = '';
    if (rules) {
      typeName = rules._def.typeName;
    }

    const baseRules = getBaseRules(rules) as ZodTypeAny;

    resultShapes.push({
      default: getDefaultValueInZodStack(rules),
      fieldName,
      required: !['ZodNullable', 'ZodOptional'].includes(typeName),
      rules: baseRules,
    });
  });
  return resultShapes;
});

const formComponent = computed(() => (props.form ? 'form' : Form));

const formComponentProps = computed(() => {
  return props.form
    ? {
        onSubmit: props.form.handleSubmit((val) => emits('submit', val)),
      }
    : {
        onSubmit: (val: GenericObject) => emits('submit', val),
      };
});

const computedSchema = computed((): FormSchema[] => {
  const {
    controlClass = '',
    disabled,
    formFieldProps = {},
    gridItemClass = '',
    hideLabel = false,
    hideRequiredMark = false,
    labelClass = '',
    labelWidth = 100,
    wrapperClass = '',
  } = props.commonConfig;
  return (props.schema || []).map((schema, index): FormSchema => {
    const keepIndex = keepFormItemIndex.value;

    const hidden =
      !props.isExpand && props.expandable && keepIndex
        ? keepIndex <= index
        : false;

    return {
      disabled,

      hideLabel,
      hideRequiredMark,
      labelWidth,
      wrapperClass,
      ...schema,
      controlClass: cn(controlClass, schema.controlClass),
      formFieldProps: {
        ...formFieldProps,
        ...schema.formFieldProps,
      },
      gridItemClass: cn(
        'flex-shrink-0',
        { hidden },
        gridItemClass,
        schema.gridItemClass,
      ),
      labelClass: cn(labelClass, schema.labelClass),
    };
  });
});
</script>

<template>
  <component :is="formComponent" v-bind="formComponentProps">
    <div ref="wrapperRef" :class="gridClass" class="grid">
      <template v-for="cSchema in computedSchema" :key="cSchema.fieldName">
        <div v-if="$slots[cSchema.fieldName]" :class="cSchema.gridItemClass">
          <slot :definition="cSchema" :name="cSchema.fieldName"> </slot>
        </div>
        <FormField
          v-else
          v-bind="cSchema"
          :class="cSchema.gridItemClass"
          :rules="cSchema.rules"
        />
      </template>
      <slot :shapes="shapes"></slot>
    </div>
  </component>
</template>
