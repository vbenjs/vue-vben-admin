import type { FormSchema } from '../src/types';

import { flushPromises, mount } from '@vue/test-utils';
import { nextTick } from 'vue';

import { afterAll, bench, describe } from 'vitest';
import { z } from 'zod';

import { setupVbenForm } from '../src/config';
import { useVbenForm } from '../src/use-vben-form';
import { TestInput } from './benchmark-fixtures';

const BENCHMARK_OPTIONS = { time: 750, warmupTime: 150 } as const;
const FIELD_COUNT = 100;
const MOUNT_FIELD_COUNT = 50;

function createFlatSchema(
  fieldCount: number,
  withRules: boolean = false,
): FormSchema[] {
  const rule = withRules ? z.string().min(1) : undefined;
  return Array.from({ length: fieldCount }, (_, index) => ({
    component: TestInput,
    defaultValue: `Value ${index}`,
    fieldName: `field${index}`,
    label: `Field ${index}`,
    rules: rule,
  }));
}

function createFlatValues(prefix: string) {
  return Object.fromEntries(
    Array.from({ length: FIELD_COUNT }, (_, index) => [
      `field${index}`,
      `${prefix} ${index}`,
    ]),
  );
}

setupVbenForm({ config: {}, rules: {} });

const flatSchema = createFlatSchema(FIELD_COUNT);
const [FlatForm, flatFormApi] = useVbenForm<Record<string, string>>({
  schema: flatSchema,
  showDefaultActions: false,
});
const flatWrapper = mount(FlatForm);

const [ValidationForm, validationFormApi] = useVbenForm<Record<string, string>>(
  {
    schema: createFlatSchema(FIELD_COUNT, true),
    showDefaultActions: false,
  },
);
const validationWrapper = mount(ValidationForm);

const dependencySchema: FormSchema[] = [
  {
    component: TestInput,
    defaultValue: 'editable',
    fieldName: 'mode',
    label: 'Mode',
  },
  ...Array.from({ length: 50 }, (_, index) => ({
    component: TestInput,
    defaultValue: `Value ${index}`,
    dependencies: {
      resolve: ({ values }) => ({ disabled: values.mode === 'locked' }),
      triggerFields: ['mode'],
    },
    fieldName: `dependent${index}`,
    label: `Dependent ${index}`,
  })),
];
const [DependencyForm, dependencyFormApi] = useVbenForm<Record<string, string>>(
  {
    schema: dependencySchema,
    showDefaultActions: false,
  },
);
const dependencyWrapper = mount(DependencyForm);

await flushPromises();

const batchValues = [createFlatValues('Alpha'), createFlatValues('Beta')];
const schemaPatches = [false, true].map((disabled) =>
  Array.from({ length: FIELD_COUNT }, (_, index) => ({
    componentProps: { disabled },
    fieldName: `field${index}`,
  })),
);
let batchIteration = 0;
let dependencyIteration = 0;
let fieldIteration = 0;
let resetIteration = 0;
let schemaIteration = 0;

afterAll(() => {
  dependencyWrapper.unmount();
  flatWrapper.unmount();
  validationWrapper.unmount();
});

describe('form render performance', () => {
  bench(
    'initialize, mount, and unmount 50 fields',
    async () => {
      const [Form] = useVbenForm<Record<string, string>>({
        schema: createFlatSchema(MOUNT_FIELD_COUNT),
        showDefaultActions: false,
      });
      const wrapper = mount(Form);
      await flushPromises();
      wrapper.unmount();
    },
    BENCHMARK_OPTIONS,
  );
});

describe('form value performance', () => {
  bench(
    'update one field in a 100-field form',
    async () => {
      fieldIteration += 1;
      await flatFormApi.setFieldValue('field50', `Value ${fieldIteration}`);
      await nextTick();
    },
    BENCHMARK_OPTIONS,
  );

  bench(
    'set 100 fields in one batch',
    async () => {
      batchIteration += 1;
      await flatFormApi.setValues(batchValues[batchIteration % 2] ?? {});
      await nextTick();
    },
    BENCHMARK_OPTIONS,
  );

  bench(
    'reset 100 fields to alternate values',
    async () => {
      resetIteration += 1;
      await flatFormApi.reset(
        { values: batchValues[resetIteration % 2] ?? {} },
        { force: true },
      );
      await nextTick();
    },
    BENCHMARK_OPTIONS,
  );
});

describe('form validation performance', () => {
  bench(
    'validate 100 fields with zod rules',
    async () => {
      await validationFormApi.validate();
    },
    BENCHMARK_OPTIONS,
  );
});

describe('form schema performance', () => {
  bench(
    'update 100 schema entries',
    async () => {
      schemaIteration += 1;
      flatFormApi.updateSchema(schemaPatches[schemaIteration % 2] ?? []);
      await nextTick();
    },
    BENCHMARK_OPTIONS,
  );

  bench(
    'resolve 50 dependencies from one trigger',
    async () => {
      dependencyIteration += 1;
      await dependencyFormApi.setFieldValue(
        'mode',
        dependencyIteration % 2 === 0 ? 'editable' : 'locked',
      );
      await flushPromises();
    },
    BENCHMARK_OPTIONS,
  );
});
