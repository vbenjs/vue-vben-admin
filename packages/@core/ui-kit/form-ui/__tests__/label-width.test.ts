/* eslint-disable vue/one-component-per-file */

import type { PropType } from 'vue';

import type { FormLayout, FormRenderProps } from '../src/types';

import { mount } from '@vue/test-utils';
import { defineComponent, h, reactive, toRefs } from 'vue';

import { describe, expect, it } from 'vitest';

import {
  provideFormRenderProps,
  useFormContext,
} from '../src/form-render/context';
import { resolveLabelStyle, useFormLabelWidth } from '../src/form-render/utils';

describe('form label width context', () => {
  it('keeps layout reactive when label width context is provided', async () => {
    const Consumer = defineComponent({
      setup() {
        const { isVertical } = useFormContext();
        return () =>
          h('div', {
            'data-layout': isVertical.value ? 'vertical' : 'horizontal',
          });
      },
    });
    const Provider = defineComponent({
      props: {
        layout: {
          required: true,
          type: String as PropType<FormLayout>,
        },
      },
      setup(props) {
        provideFormRenderProps(
          reactive({
            ...toRefs(props as FormRenderProps),
            ...useFormLabelWidth(),
          }),
        );
        return () => h(Consumer);
      },
    });
    const wrapper = mount(Provider, {
      props: { layout: 'horizontal' },
    });

    expect(wrapper.get('[data-layout]').attributes('data-layout')).toBe(
      'horizontal',
    );

    await wrapper.setProps({ layout: 'vertical' });

    expect(wrapper.get('[data-layout]').attributes('data-layout')).toBe(
      'vertical',
    );
  });
});

describe('resolveLabelStyle', () => {
  it('returns empty style for vertical layout', () => {
    expect(
      resolveLabelStyle({
        labelWidth: 'auto',
        labelClass: undefined,
        isVertical: true,
        autoLabelWidth: '120px',
        computedWidth: 80,
      }),
    ).toEqual({});
  });

  it('returns empty style when labelClass includes w-', () => {
    expect(
      resolveLabelStyle({
        labelWidth: 100,
        labelClass: 'w-32',
        isVertical: false,
        autoLabelWidth: '120px',
        computedWidth: 80,
      }),
    ).toEqual({});
  });

  it('aligns auto width with max label using marginLeft by default', () => {
    expect(
      resolveLabelStyle({
        labelWidth: 'auto',
        labelClass: undefined,
        isVertical: false,
        autoLabelWidth: '120px',
        computedWidth: 80,
      }),
    ).toEqual({
      width: 'auto',
      marginLeft: '40px',
    });
  });

  it('uses marginRight when labelClass is justify-start', () => {
    expect(
      resolveLabelStyle({
        labelWidth: 'auto',
        labelClass: 'justify-start',
        isVertical: false,
        autoLabelWidth: '100px',
        computedWidth: 60,
      }),
    ).toEqual({
      width: 'auto',
      marginRight: '40px',
    });
  });

  it('uses numeric labelWidth as px', () => {
    expect(
      resolveLabelStyle({
        labelWidth: 100,
        labelClass: undefined,
        isVertical: false,
        autoLabelWidth: '0',
        computedWidth: 0,
      }),
    ).toEqual({ width: '100px' });
  });

  it('passes through string labelWidth', () => {
    expect(
      resolveLabelStyle({
        labelWidth: '8rem',
        labelClass: undefined,
        isVertical: false,
        autoLabelWidth: '0',
        computedWidth: 0,
      }),
    ).toEqual({ width: '8rem' });
  });
});
