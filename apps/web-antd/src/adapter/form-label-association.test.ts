import { createApp, h, nextTick } from 'vue';

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { initComponentAdapter } from './component';
import { initSetupVbenForm, useVbenForm } from './form';

const flushPromises = async () => {
  await Promise.resolve();
  await nextTick();
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

let unmount: (() => void) | undefined;

beforeAll(async () => {
  await initComponentAdapter();
  await Promise.all([
    import('ant-design-vue/es/input'),
    import('ant-design-vue/es/select'),
    import('ant-design-vue/es/date-picker'),
  ]);
  await initSetupVbenForm();
});

afterEach(() => {
  unmount?.();
});

describe('ant design form labels', () => {
  it('points delayed and composite controls to their mounted native input', async () => {
    const [Form] = useVbenForm({
      schema: [
        { component: 'Input', fieldName: 'keyword', label: 'Keyword' },
        {
          component: 'Select',
          componentProps: { options: [] },
          fieldName: 'status',
          label: 'Status',
        },
        {
          component: 'RangePicker',
          fieldName: 'period',
          label: 'Period',
        },
        {
          component: 'RadioGroup',
          componentProps: {
            options: [
              { label: 'Enabled', value: 'enabled' },
              { label: 'Disabled', value: 'disabled' },
            ],
          },
          fieldName: 'enabled',
          label: 'Enabled state',
        },
      ],
    });

    const container = document.createElement('div');
    document.body.append(container);
    const app = createApp({ render: () => h(Form) });
    app.mount(container);
    unmount = () => {
      app.unmount();
      container.remove();
    };
    await flushPromises();

    let items: HTMLElement[] = [];
    await vi.waitFor(
      () => {
        items = [
          ...container.querySelectorAll<HTMLElement>('[data-slot="form-item"]'),
        ];
        expect(items).toHaveLength(4);
        expect(items.every((item) => item.querySelector('input'))).toBe(true);
      },
      { timeout: 5000 },
    );

    const nativeFieldNames = ['keyword', 'status', 'period'];
    const nativeAssociations = items.slice(0, 3).map((item, index) => {
      const label = item.querySelector<HTMLLabelElement>(
        'label[data-slot="form-label"]',
      );
      const input = item.querySelector<HTMLInputElement>('input');
      const target = label?.htmlFor
        ? [...container.querySelectorAll('[id]')].find(
            (element) => element.id === label.htmlFor,
          )
        : undefined;

      return {
        fieldName: nativeFieldNames[index],
        htmlFor: label?.htmlFor ?? '',
        inputId: input?.id ?? '',
        targetTag: target?.tagName ?? 'missing',
        targetsActualInput: target === input,
      };
    });
    expect(
      nativeAssociations.every(
        ({ htmlFor, inputId, targetTag, targetsActualInput }) =>
          Boolean(htmlFor) &&
          htmlFor === inputId &&
          targetTag === 'INPUT' &&
          targetsActualInput,
      ),
    ).toBe(true);

    const groupItem = items[3];
    const groupName = groupItem?.querySelector<HTMLElement>(
      '[data-slot="form-label"]',
    );
    const radioGroup = groupItem?.querySelector<HTMLElement>(
      '[role="radiogroup"]',
    );
    expect(groupName?.tagName).toBe('DIV');
    expect(groupName?.id).toBe(`${radioGroup?.id}-label`);
    expect(groupName?.textContent?.trim()).toBe('Enabled state');
    expect(groupName?.hidden).toBe(false);
    expect(groupName?.getAttribute('for')).toBeNull();
    expect(
      groupItem?.querySelector('label[data-slot="form-label"]'),
    ).toBeNull();
    expect(radioGroup).not.toBeNull();
    expect(radioGroup?.getAttribute('aria-labelledby')).toBe(groupName?.id);

    const radios = [
      ...(groupItem?.querySelectorAll<HTMLInputElement>(
        'input[type="radio"]',
      ) ?? []),
    ];
    expect(radios).toHaveLength(2);
    radios[1]?.click();
    await vi.waitFor(() => expect(radios[1]?.checked).toBe(true));
    const selectedBeforeLabelClick = radios.map((radio) => radio.checked);
    groupName?.click();
    await flushPromises();
    expect(radios.map((radio) => radio.checked)).toEqual(
      selectedBeforeLabelClick,
    );
  });

  it('keeps explicit radio group names when no schema label is rendered', async () => {
    const [Form] = useVbenForm({
      schema: [
        {
          component: 'RadioGroup',
          componentProps: {
            'aria-label': 'Required choice',
            options: [{ label: 'Yes', value: 'yes' }],
          },
          fieldName: 'requiredChoice',
          rules: 'required',
        },
        {
          component: 'RadioGroup',
          componentProps: {
            'aria-label': 'Hidden label choice',
            options: [{ label: 'Yes', value: 'yes' }],
          },
          fieldName: 'hiddenLabelChoice',
          hideLabel: true,
          label: 'Not rendered',
        },
      ],
    });

    const container = document.createElement('div');
    document.body.append(container);
    const app = createApp({ render: () => h(Form) });
    app.mount(container);
    unmount = () => {
      app.unmount();
      container.remove();
    };

    await vi.waitFor(
      () => {
        expect(container.querySelectorAll('[role="radiogroup"]')).toHaveLength(
          2,
        );
      },
      { timeout: 5000 },
    );

    const items = [...container.querySelectorAll('[data-slot="form-item"]')];
    expect(
      items[0]?.querySelector('[data-slot="form-label"]')?.textContent?.trim(),
    ).toBe('*');
    expect(items[1]?.querySelector('[data-slot="form-label"]')).toBeNull();
    const groups = [...container.querySelectorAll('[role="radiogroup"]')];
    expect(groups.map((group) => group.getAttribute('aria-label'))).toEqual([
      'Required choice',
      'Hidden label choice',
    ]);
    expect(
      groups.map((group) => group.getAttribute('aria-labelledby')),
    ).toEqual([null, null]);
  });
});
