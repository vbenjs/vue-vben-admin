import { defineComponent } from 'vue';

import { globalShareState } from '@vben-core/shared/global-state';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  COMPONENT_BIND_EVENT_MAP,
  COMPONENT_MAP,
  setupVbenForm,
} from '../src/config';

const builtInCheckbox = COMPONENT_MAP.VbenCheckbox;
const componentMapReference = COMPONENT_MAP;
const bindEventMapReference = COMPONENT_BIND_EVENT_MAP;

function resetFormConfig() {
  globalShareState.setComponents({});
  setupVbenForm({ config: {} });
}

beforeEach(resetFormConfig);
afterEach(resetFormConfig);

describe('setupVbenForm', () => {
  it('rebuilds user mappings while preserving built-ins and record identity', () => {
    const FirstInput = defineComponent({});
    const SecondInput = defineComponent({});

    globalShareState.setComponents({ FirstInput });
    setupVbenForm({ config: { baseModelPropName: 'value' } });

    expect(COMPONENT_MAP.FirstInput).toBe(FirstInput);
    expect(COMPONENT_BIND_EVENT_MAP.FirstInput).toBe('value');

    globalShareState.setComponents({ SecondInput });
    setupVbenForm({ config: {} });

    expect(COMPONENT_MAP).toBe(componentMapReference);
    expect(COMPONENT_BIND_EVENT_MAP).toBe(bindEventMapReference);
    expect(Reflect.has(COMPONENT_MAP, 'FirstInput')).toBe(false);
    expect(Reflect.has(COMPONENT_BIND_EVENT_MAP, 'FirstInput')).toBe(false);
    expect(COMPONENT_MAP.SecondInput).toBe(SecondInput);
    expect(COMPONENT_BIND_EVENT_MAP.SecondInput).toBeUndefined();
    expect(COMPONENT_MAP.VbenCheckbox).toBe(builtInCheckbox);
    expect(COMPONENT_BIND_EVENT_MAP.VbenCheckbox).toBe('checked');
  });

  it('prefers component mappings over the base model prop name', () => {
    const CustomInput = defineComponent({});
    globalShareState.setComponents({ CustomInput });

    setupVbenForm({
      config: {
        baseModelPropName: 'value',
        modelPropNameMap: { CustomInput: 'checked' },
      },
    });

    expect(COMPONENT_BIND_EVENT_MAP.CustomInput).toBe('checked');
  });
});
