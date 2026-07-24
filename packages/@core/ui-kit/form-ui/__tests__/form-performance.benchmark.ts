import { flushPromises, mount } from '@vue/test-utils';
import { nextTick } from 'vue';

import { afterAll, bench, describe } from 'vitest';

import { setupVbenForm } from '../src/config';
import { encodeFormValues } from '../src/form-codec';
import { useVbenForm } from '../src/use-vben-form';
import { TestInput } from './benchmark-fixtures';

interface ContactValues {
  enabled: boolean;
  metadata: {
    permissions: string[];
    team: string;
  };
  name: string;
  phone: string;
  tags: string[];
}

interface PerformanceFormValues extends Record<string, unknown> {
  contacts: ContactValues[];
  settings: {
    alerts: boolean;
    locale: string;
    sections: string[];
  };
}

const ROW_COUNT = 100;

function createFormValues(): PerformanceFormValues {
  return {
    contacts: Array.from({ length: ROW_COUNT }, (_, index) => ({
      enabled: index % 2 === 0,
      metadata: {
        permissions: ['read', 'write', 'review'],
        team: `team-${index % 10}`,
      },
      name: ` Contact ${index} `,
      phone: `10086-${index}`,
      tags: ['primary', 'on-call', `group-${index % 5}`],
    })),
    settings: {
      alerts: true,
      locale: 'zh-CN',
      sections: ['profile', 'security', 'notifications'],
    },
  };
}

const codec = {
  decode: (values: Readonly<PerformanceFormValues>) => ({ ...values }),
  encode: (values: Readonly<PerformanceFormValues>) => ({
    ...values,
    contacts: values.contacts.map((contact) => ({
      ...contact,
      name: contact.name.trim(),
    })),
  }),
};

const formValues = createFormValues();
setupVbenForm({ config: {}, rules: {} });
const [CodecForm, codecFormApi] = useVbenForm<PerformanceFormValues>({
  codec,
  schema: [
    {
      component: TestInput,
      defaultValue: formValues.contacts,
      fieldName: 'contacts',
    },
    {
      component: TestInput,
      defaultValue: formValues.settings,
      fieldName: 'settings',
    },
  ],
  showDefaultActions: false,
});
const codecWrapper = mount(CodecForm);
const [ArrayForm, arrayFormApi] = useVbenForm({
  schema: [
    {
      children: [
        {
          component: TestInput,
          fieldName: 'name',
          label: 'Name',
        },
      ],
      defaultValue: Array.from({ length: ROW_COUNT }, (_, index) => ({
        name: `Contact ${index}`,
      })),
      fieldName: 'contacts',
      type: 'array',
    },
  ],
});
const arrayWrapper = mount(ArrayForm);
await flushPromises();
const arraySchemaPatches = [false, true].map((disabled) => ({
  componentProps: { disabled },
  fieldName: 'contacts.name',
}));
let arrayEditIteration = 0;
let arraySchemaIteration = 0;

afterAll(() => {
  arrayWrapper.unmount();
  codecWrapper.unmount();
});

describe('form codec performance', () => {
  bench(
    'encode 100 nested rows without isolation',
    () => {
      encodeFormValues(codec, formValues);
    },
    { time: 1000, warmupTime: 200 },
  );

  bench(
    'encode 100 nested rows with isolated input',
    () => {
      codecFormApi.formatValues(formValues);
    },
    { time: 1000, warmupTime: 200 },
  );

  bench(
    'create submit snapshot for 100 nested rows',
    async () => {
      await codecFormApi.getValueSnapshot();
    },
    { time: 1000, warmupTime: 200 },
  );
});

describe('form array performance', () => {
  bench(
    'edit one field in a 100-row array',
    async () => {
      arrayEditIteration += 1;
      await arrayFormApi.setFieldValue(
        'contacts[50].name',
        `Contact ${arrayEditIteration}`,
      );
      await nextTick();
    },
    { time: 1000, warmupTime: 200 },
  );

  bench(
    'append and remove one row from a 100-row array',
    async () => {
      arrayFormApi.form.pushFieldValue('contacts', { name: 'Temporary' });
      await nextTick();
      await arrayFormApi.form.removeFieldValue('contacts', ROW_COUNT);
      await nextTick();
    },
    { time: 1000, warmupTime: 200 },
  );

  bench(
    'update one child schema across 100 rows',
    async () => {
      arraySchemaIteration += 1;
      arrayFormApi.updateSchema([
        arraySchemaPatches[arraySchemaIteration % 2] ?? {},
      ]);
      await nextTick();
    },
    { time: 1000, warmupTime: 200 },
  );
});
