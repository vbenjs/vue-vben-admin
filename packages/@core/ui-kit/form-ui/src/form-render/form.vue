<script setup lang="ts">
import type { ZodType } from 'zod';

import type {
  FormCommonConfig,
  FormFieldSchema,
  FormGroupSchema,
  FormRenderProps,
  FormShape,
} from '../types';
import type { NormalizedFormFieldSchema } from './schema';

import { computed, reactive, toRaw, toRefs } from 'vue';

import { cn, isString } from '@vben-core/shared/utils';

import { provideFormRenderProps } from './context';
import { useExpandable } from './expandable';
import FormField from './form-field.vue';
import FormGroup from './form-group.vue';
import { getBaseRules, getDefaultValueInZodStack } from './helper';
import {
  createFormFieldSchema,
  getFormFieldSchemas,
  isFormGroupSchema,
} from './schema';
import { useFormLabelWidth } from './utils';

interface NormalizedFormGroupSchema extends FormGroupSchema {
  fields: NormalizedFormFieldSchema[];
  hidden: boolean;
  key: string;
}

interface Props extends FormRenderProps {}

const props = withDefaults(
  defineProps<Props & { globalCommonConfig?: FormCommonConfig }>(),
  {
    collapsedRows: 1,
    commonConfig: () => ({}),
    globalCommonConfig: () => ({}),
    showCollapseButton: false,
    wrapperClass: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  },
);

const emits = defineEmits<{
  submit: [event: any];
}>();

function getWrapperClass(gridClass?: string) {
  const cls = ['flex'];
  if (props.layout === 'inline') {
    cls.push('flex-wrap gap-x-2');
  } else {
    cls.push(props.compact ? 'gap-x-2' : 'gap-x-4', 'flex-col grid');
  }
  return cn(...cls, gridClass);
}

const wrapperClass = computed(() => getWrapperClass(props.wrapperClass));

provideFormRenderProps(reactive({ ...toRefs(props), ...useFormLabelWidth() }));

// @ts-expect-error unused
const { isCalculated, keepFormItemIndex, wrapperRef } = useExpandable(props);

const formFieldSchemas = computed(() => {
  return getFormFieldSchemas(props.schema ?? []);
});

const shapes = computed(() => {
  const resultShapes: FormShape[] = [];
  formFieldSchemas.value.forEach((schema) => {
    const { fieldName } = schema;
    const rules = toRaw(schema.rules) as ZodType;

    const baseRules = getBaseRules(rules) as ZodType;

    resultShapes.push({
      default: getDefaultValueInZodStack(rules),
      fieldName,
      required: Boolean(rules && !isString(rules) && !rules.isOptional()),
      rules: baseRules,
    });
  });
  return resultShapes;
});

const formComponent = 'form';

const formComponentProps = computed(() => {
  return props.form
    ? {
        onSubmit: props.form.handleSubmit(() => emits('submit', undefined)),
      }
    : {
        onSubmit: (event: Event) => {
          event.preventDefault();
          emits('submit', event);
        },
      };
});

const formCollapsed = computed(() => {
  return props.collapsed && isCalculated.value;
});

function normalizeFieldSchema(schema: FormFieldSchema, hidden = false) {
  return createFormFieldSchema(schema as never, {
    commonConfig: props.commonConfig,
    globalCommonConfig: props.globalCommonConfig,
    hidden,
  });
}

const computedSchema = computed(
  (): Array<NormalizedFormFieldSchema | NormalizedFormGroupSchema> => {
    const keepIndex = keepFormItemIndex.value;
    const result: Array<NormalizedFormFieldSchema | NormalizedFormGroupSchema> =
      [];

    (props.schema ?? []).forEach((schema, index) => {
      const hidden =
        // 折叠状态 & 显示折叠按钮 & 当前索引大于保留索引（分组按一个顶层项计算）
        props.showCollapseButton && !!formCollapsed.value && keepIndex
          ? keepIndex <= index
          : false;

      if (isFormGroupSchema(schema)) {
        if (schema.hide || schema.children.length === 0) {
          return;
        }
        result.push({
          ...schema,
          fields: schema.children.map((field) => normalizeFieldSchema(field)),
          hidden,
          key: schema.name ?? `group-${index}`,
        });
        return;
      }

      result.push(normalizeFieldSchema(schema, hidden));
    });

    return result;
  },
);

function isNormalizedFormGroupSchema(
  schema: NormalizedFormFieldSchema | NormalizedFormGroupSchema,
): schema is NormalizedFormGroupSchema {
  return isFormGroupSchema(schema);
}

function getGroupWrapperClass(schema: NormalizedFormGroupSchema) {
  return getWrapperClass(schema.wrapperClass ?? props.wrapperClass);
}
</script>

<template>
  <component :is="formComponent" v-bind="formComponentProps">
    <div ref="wrapperRef" :class="wrapperClass">
      <template
        v-for="cSchema in computedSchema"
        :key="
          isNormalizedFormGroupSchema(cSchema) ? cSchema.key : cSchema.fieldName
        "
      >
        <FormGroup
          v-if="isNormalizedFormGroupSchema(cSchema)"
          :content-class="getGroupWrapperClass(cSchema)"
          :hidden="cSchema.hidden"
          :schema="cSchema"
        >
          <FormField
            v-for="fieldSchema in cSchema.fields"
            :key="fieldSchema.fieldName"
            v-bind="fieldSchema"
            :class="fieldSchema.formItemClass"
            :rules="fieldSchema.rules"
          >
            <template #default="slotProps">
              <slot v-bind="slotProps" :name="fieldSchema.fieldName"></slot>
            </template>
          </FormField>
        </FormGroup>
        <!-- <div v-if="$slots[cSchema.fieldName]" :class="cSchema.formItemClass">
          <slot :definition="cSchema" :name="cSchema.fieldName"> </slot>
        </div> -->
        <FormField
          v-else
          v-bind="cSchema"
          :class="cSchema.formItemClass"
          :rules="cSchema.rules"
        >
          <template #default="slotProps">
            <slot v-bind="slotProps" :name="cSchema.fieldName"> </slot>
          </template>
        </FormField>
      </template>
      <slot :shapes="shapes"></slot>
    </div>
  </component>
</template>
